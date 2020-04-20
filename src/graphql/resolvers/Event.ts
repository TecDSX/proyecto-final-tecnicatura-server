/* eslint-disable no-unused-vars */
import { Context } from '../context';
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
  if (event.state === 'cancelled' || event.state === 'finalized')
    throw new Error('You can not update Events finalized or cancelled');
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
      const event = await Event.findByIdAndUpdate(
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
      return await Event.create({ ...data });
    },

    updateEvent: async (
      _: any,
      { input: { ...data }, eventId }: UpdateEventInput,
      { models: { Event } }: Context
    ) => {
      await existsEvent(eventId, Event);
      const eventData = data;
      return await Event.findByIdAndUpdate(
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
      const event = await Event.findByIdAndUpdate(
        { _id: eventId },
        { $set: { state: 'cancelled' } },
        (err, doc) => Promise.all([err, doc])
      );
      return !!event || false;
    },
  },
};
