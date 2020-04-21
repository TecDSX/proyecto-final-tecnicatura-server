/* eslint-disable no-unused-vars */
import { Context } from '../context';
import { dateGreaterOrEqualThanDate } from '../../utils/utils';
import {
  SetEventStateInput,
  CreateEventInput,
  UpdateEventInput,
  DeleteEventInput,
  GetEventInput,
} from '../../interfaces';
import { withFilter } from 'graphql-yoga';
import { pubsub } from '../pubsub';

export const existsEvent = async (eventId: string, Event: any) => {
  const event = await Event.findOne({ _id: eventId });
  if (!event) throw new Error('Event not exists');
  if (event.state === 'finalized' || event.state === 'cancelled')
    throw new Error('You can not update finished o canceled Events');
};

export default {
  Event: {
    participations: async (
      { _id: eventId }: any,
      _: any,
      { models: { Participation } }: Context
    ) => await Participation.find({ event: eventId }),
    questions: async (
      { questions }: any,
      _: any,
      { models: { Question } }: Context
    ) => await Question.find({ _id: questions }),
  },
  Query: {
    getEvents: async (_: any, __: any, { models: { Event } }: Context) =>
      await Event.find({ state: { $nin: ['cancelled'] } }),
    getEvent: async (
      _: any,
      { eventId }: GetEventInput,
      { models: { Event } }: Context
    ) => await Event.findOne({ _id: eventId }),
  },
  Mutation: {
    setEventState: async (
      _: any,
      { state, eventId }: SetEventStateInput,
      { models: { Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      const event = await Event.findOneAndUpdate(
        { _id: eventId },
        { $set: { state } },
        (err: any, doc: any) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeEvent', { subscribeEvent: event });
      return !!event || false;
    },

    createEvent: async (
      _: any,
      { input: { ...data } }: CreateEventInput,
      { models: { Event } }: Context
    ) => {
      if (data.start && data.start.length <= 0)
        throw new Error('StartDate can not be null');
      if (data.end && data.end.length <= 0)
        throw new Error('EndDate can not be null');
      if (
        data.start &&
        !dateGreaterOrEqualThanDate(data.start, new Date().toString())
      )
        throw new Error('Event can not start in this date');
      if (
        !dateGreaterOrEqualThanDate(
          data.end,
          data.start || new Date().toString()
        )
      )
        throw new Error('Event can not end in this date');
      return await Event.create({ ...data });
    },

    updateEvent: async (
      _: any,
      { input: { ...data }, eventId }: UpdateEventInput,
      { models: { Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      if (data.start && data.start.length <= 0)
        throw new Error('StartDate can not be null');
      if (data.end && data.end.length <= 0)
        throw new Error('EndDate can not be null');
      if (
        data.start &&
        !dateGreaterOrEqualThanDate(data.start, new Date().toString())
      )
        throw new Error('Event can not start in this date');
      if (
        data.end &&
        !dateGreaterOrEqualThanDate(
          data.end,
          data.start || new Date().toString()
        )
      )
        throw new Error('Event can not end in this date');
      const eventData = data;
      const event = await Event.findOneAndUpdate(
        { _id: eventId },
        // @ts-ignore
        { $set: eventData },
        (err: any, doc: any) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeEvent', { subscribeEvent: event });
      return event;
    },

    deleteEvent: async (
      _: any,
      { eventId }: DeleteEventInput,
      { models: { Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      const event = await Event.findOneAndUpdate(
        { _id: eventId },
        { $set: { state: 'cancelled' } },
        (err, doc) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeEvent', { subscribeEvent: event });
      return !!event || false;
    },
  },
  Subscription: {
    subscribeEvent: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('subscribeEvent'),
        ({ subscribeEvent: { _id } }, { eventId }) => {
          return String(_id) === String(eventId);
        }
      ),
    },
  },
};
