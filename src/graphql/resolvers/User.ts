/* eslint-disable no-unused-vars */
import { Context } from '../context';
import { encrypt, createToken } from '../../utils/utils';
import {
  LoginInput,
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  SetUserStateInput,
} from '../../interfaces';
import { pubsub } from '../pubsub';
import { withFilter } from 'graphql-yoga';

export const existsUser = async (userId: string, User: any) => {
  const user = await User.findOne({ _id: userId, active: true });
  if (!user) throw new Error('User not exists');
};
const vinculeSubscribes = async (
  userId: string,
  Participation: any,
  Event: any
) => {
  const participations = await Participation.find({ user: userId });
  participations.map(async (participation: any) => {
    pubsub.publish('subscribeParticipation', {
      subscribeParticipation: participation,
    });
    const event = await Event.findOne({ _id: participation.event });
    pubsub.publish('subscribeEvent', { subscribeEvent: event });
  });
};

export default {
  User: {
    participations: async (
      { _id: userId }: any,
      _: any,
      { models: { Participation } }: Context
    ) => await Participation.find({ user: userId }),
  },
  Query: {
    getUsers: async (_: any, __: any, { models: { User } }: Context) =>
      await User.find({ active: true }),
  },
  Mutation: {
    login: async (
      _: any,
      { input: { email, password } }: LoginInput,
      { models: { User } }: Context
    ) => {
      password = encrypt(password).toString();
      const user = await User.findOne({ email, password });
      if (!user) throw new Error('Invalid Login');
      if (!user.active) throw new Error('Your account is not activated yet');
      const { password: passwd, ...data } = user;
      return {
        token: createToken({ ...data, token: passwd }),
      };
    },
    setUserState: async (
      _: any,
      { state, userId }: SetUserStateInput,
      { models: { User, Participation, Event } }: Context
    ) => {
      await existsUser(userId, User);
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { state } },
        (err, doc) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeUser', {
        subscribeUser: user,
      });
      vinculeSubscribes(userId, Participation, Event);
      return !!user || false;
    },
    createUser: async (
      _: any,
      { input: { password, ...data } }: CreateUserInput,
      { models: { User } }: Context
    ) => {
      password = encrypt(password).toString();
      return await User.create({ ...data, password });
    },
    updateUser: async (
      _: any,
      { input: { password, ...data }, userId }: UpdateUserInput,
      { models: { User, Participation, Event } }: Context
    ) => {
      await existsUser(userId, User);
      if (password) password = encrypt(password).toString();
      const Data = password ? { ...data, password } : data;
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: Data },
        (err, doc) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeUser', {
        subscribeUser: user,
      });
      vinculeSubscribes(userId, Participation, Event);
      return user;
    },
    deleteUser: async (
      _: any,
      { userId }: DeleteUserInput,
      { models: { User, Participation, Event } }: Context
    ) => {
      await existsUser(userId, User);
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { active: false } },
        (err, doc) => Promise.all([err, doc])
      );
      pubsub.publish('subscribeUser', {
        subscribeUser: user,
      });
      vinculeSubscribes(userId, Participation, Event);
      return !!user || false;
    },
  },
  Subscription: {
    subscribeUser: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('subscribeUser'),
        ({ subscribeUser: { _id } }, { userId }) => {
          console.log(userId, _id);
          return String(userId) === String(_id);
        }
      ),
    },
  },
};
