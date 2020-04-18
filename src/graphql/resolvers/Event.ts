/* eslint-disable no-unused-vars */
import { Context } from '../context';
import { dateGreaterOrEqualThanDate } from '../../utils/utils';
import {
  SetEventStateInput,
  CreateEventInput,
  UpdateEventInput,
  DeleteEventInput,
  // inputs
} from '../../interfaces';

const existsEvent = async (eventId: string, Event: any) => {
  const event = await Event.findById({ _id: eventId });
  if (!event) throw new Error('Event not exists');
};

export default {
  Query: {
    getEvents: async (_: any, __: any, { models: { Event } }: Context) =>
      await Event.find({ state: { $not: { $in: ['cancelled'] } } }),
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
        (err, doc) => Promise.all([err, doc])
      );
      return !!event || false;
    },

    createEvent: async (
      _: any,
      { input: { ...data } }: CreateEventInput,
      { models: { Event } }: Context
    ) => {
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
      return await Event.findOneAndUpdate(
        { _id: eventId, state: { $nin: ['cancelled', 'finalized'] } },
        { $set: eventData },
        (err, doc) => Promise.all([err, doc])
      );
    },

    deleteEvent: async (
      _: any,
      { eventId }: DeleteEventInput,
      { models: { Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      const event = await Event.findOneAndUpdate(
        { _id: eventId, state: { $nin: ['cancelled', 'finalized'] } },
        { $set: { state: 'cancelled' } },
        (err, doc) => Promise.all([err, doc])
      );
      return !!event || false;
    },
  },
};
