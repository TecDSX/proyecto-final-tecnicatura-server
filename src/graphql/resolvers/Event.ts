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

export const existsEvent = async (eventId: string, Event: any) => {
  const event = await Event.findOne({ _id: eventId });
  if (!event) throw new Error('Event not exists');
  if (event.state === 'finalized' || event.state === 'cancelled')
    throw new Error('You can not update finished o canceled Events');
};

export default {
  Event: {
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
        { _id: eventId },
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
        { _id: eventId },
        { $set: { state: 'cancelled' } },
        (err, doc) => Promise.all([err, doc])
      );
      return !!event || false;
    },
  },
};
