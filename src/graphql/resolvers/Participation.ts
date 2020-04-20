/* eslint-disable no-unused-vars */
import { Context } from '../context';
import {
  CreateParticipationInput,
  UpdateParticipationInput
} from '../../interfaces';
import { existsUser } from './User';
import { existsEvent } from './Event';

export const existsParticipation = async (participationId: string, Participation: any) => {
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
    getParticipations: async (_: any, __: any, { models: { Participation } }: Context) =>
      await Participation.find(),
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
      return participation;
    },
  }
}
