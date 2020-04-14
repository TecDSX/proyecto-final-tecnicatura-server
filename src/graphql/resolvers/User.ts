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
const existsUser = async (userId: string, User: any) => {
  const user = await User.findById({ _id: userId });
  if (!user) throw new Error('User not exists');
};
export default {
  Query: {
    getUsers: async (_: any, __: any, { models: { User } }: Context) =>
      await User.find(),
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
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { state } },
        (err, doc) => Promise.all([err, doc])
      );
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
      const userData = password ? { ...data, password } : data;
      return await User.findByIdAndUpdate(
        { _id: userId },
        { $set: userData },
        (err, doc) => Promise.all([err, doc])
      );
    },
    deleteUser: async (
      _: any,
      { userId }: DeleteUserInput,
      { models: { User } }: Context
    ) => {
      await existsUser(userId, User);
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { active: false } },
        (err, doc) => Promise.all([err, doc])
      );
      return !!user || false;
    },
  },
};
