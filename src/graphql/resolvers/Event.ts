import { tModels, iEventInput } from "../../interfaces";

export default {
  Query: {
    getEvents: async (_: any, __: any, { models: { Event } }: { models: tModels }) => await Event.find(),
  },
  Mutation: {
    createEvent: async (_: any, { input }: iEventInput, { models: { Event } }: { models: tModels }) => await Event.create(input),
  }
}
