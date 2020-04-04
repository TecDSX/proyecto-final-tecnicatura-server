/* eslint-disable no-unused-vars */
import {
  tModels,
  iCreateUserInput,
  iLogin,
  iLoginInput,
  iUpdateUserInput,
} from '../../interfaces/index';
import { encrypt, createToken } from '../../utils/utils';
export default {
  Query: {
    getUsers: async (
      _: any,
      __: any,
      { models: { User } }: { models: tModels }
    ) => {
      return await User.find();
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: iCreateUserInput,
      { models: { User } }: { models: tModels }
    ) => {
      return await User.create({ ...input, password: encrypt(input.password) });
    },
    login: async (
      _: any,
      { input }: iLoginInput,
      { models: { User } }: { models: tModels }
    ): Promise<iLogin> => {
      input.password = encrypt(input.password).toString();
      const user = await User.findOne(input);
      if (!user) throw new Error('Invalid Login');
      if (!user.active) throw new Error('Your account is not activated yet');
      const token = await createToken({ ...user, token: user.password });
      return {
        token,
      };
    },
    updateUser: async (
      _: any,
      { input, _id }: iUpdateUserInput,
      { models: { User } }: { models: tModels }
    ) => {
      if (input.password) input.password = encrypt(input.password).toString();
      return await User.findOneAndUpdate(
        { _id },
        { $set: input },
        (err, data) => Promise.all([err, data])
      );
    },
  },
};
