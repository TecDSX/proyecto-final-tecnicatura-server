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
export default {
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
      { models: { User } }: Context
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
      { models: { User } }: Context
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
      return user;
    },
    deleteUser: async (
      _: any,
      { userId }: DeleteUserInput,
      { models: { User } }: Context
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
