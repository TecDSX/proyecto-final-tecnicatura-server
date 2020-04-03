/* eslint-disable no-unused-vars */
import {
  tModels,
  iCreateUserInput,
  iLogin,
  iLoginInput,
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
      const { password, ...data } = input;
      return await User.create({ ...data, password: encrypt(password) });
    },
    login: async (
      _: any,
      { input }: iLoginInput,
      { models: { User } }: { models: tModels }
    ): Promise<iLogin> => {
      const { email, password: pass } = input;
      const user = await User.findOne({
        email,
        password: encrypt(pass).toString(),
      });
      if (!user) throw new Error('Invalid Login');
      if (!user.active) throw new Error('Your account is not activated yet');
      const { password, ...data } = user;
      const token = await createToken({ ...data, token: password });
      return {
        token,
      };
    },
  },
};
