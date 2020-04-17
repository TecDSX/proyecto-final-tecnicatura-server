/* eslint-disable no-unused-vars */
import { Context } from '../context';
import { encrypt, createToken } from '../../utils/utils';
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
      await Event.find({ active: true }),
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
        { $set: { active: false } },
        (err, doc) => Promise.all([err, doc])
      );
      return !!event || false;
    },
  },
};
