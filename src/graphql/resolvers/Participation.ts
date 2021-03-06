/* eslint-disable no-unused-vars */
import { Context } from '../context';
import { pubsub } from '../pubsub';
import { withFilter } from 'graphql-yoga';
import {
  CreateParticipationInput,
  UpdateParticipationInput,
} from '../../interfaces';
import { existsUser } from './User';
import { existsEvent } from './Event';
import { EventStates } from '../../models/Event';

export const existsParticipation = async (
  participationId: string,
  Participation: any
) => {
  const participation = await Participation.findById({ _id: participationId });
  if (!participation) throw new Error('Participation not exists');
};
export default {
  Participation: {
    user: async ({ user }: any, _: any, { models: { User } }: Context) =>
      await User.findById({ _id: user }),
    event: async ({ event }: any, _: any, { models: { Event } }: Context) =>
      await Event.findById({ _id: event }),
  },
  Query: {
    getParticipations: async (
      _: any,
      __: any,
      { models: { Participation } }: Context
    ) => await Participation.find(),
  },
  Mutation: {
    createParticipation: async (
      _: any,
      { input: { eventId, userId, ...data } }: CreateParticipationInput,
      { models: { User, Event, Participation } }: Context
    ) => {
      await existsEvent(eventId, Event);
      await existsUser(userId, User);
      const participation = await Participation.create({
        user: userId,
        event: eventId,
        ...data,
      });
      const user = await User.findOne({ _id: userId });
      const event = await Event.findOne({ _id: eventId });
      pubsub.publish('subscribeUser', {
        subscribeUser: user,
      });
      pubsub.publish('subscribeEvent', {
        subscribeUser: event,
      });
      return participation;
    },

    updateParticipation: async (
      _: any,
      { input: { ...data }, participationId }: UpdateParticipationInput,
      { models: { Participation, User, Event } }: Context
    ) => {
      await existsParticipation(participationId, Participation);
      const participation: any = await Participation.findOne({
        _id: participationId,
      });
      if (participation.event.state === EventStates[2])
        throw new Error('You cannot update participation of a finalized event');
      if (participation.event.state === EventStates[3])
        throw new Error('You cannot update participation of a cancelled event');
      const participationUpdated: any = await Participation.findByIdAndUpdate(
        { _id: participationId },
        { $set: data },
        (err, doc) => Promise.all([err, doc])
      );
      const user = await User.findOne({ _id: participationUpdated.user });
      const event = await Event.findOne({ _id: participationUpdated.event });
      pubsub.publish('subscribeParticipation', {
        subscribeParticipation: participationUpdated,
      });
      pubsub.publish('subscribeUser', {
        subscribeUser: user,
      });
      pubsub.publish('subscribeEvent', {
        subscribeUser: event,
      });
      return participationUpdated;
    },
  },
  Subscription: {
    subscribeParticipation: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('subscribeParticipation'),
        ({ subscribeParticipation: { _id } }, { participationId }) => {
          return String(participationId) === String(_id);
        }
      ),
    },
  },
};
