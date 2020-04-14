// eslint-disable-next-line no-unused-vars
import { Context } from '../context';
export default {
  Query: {
    getUsers: async (_: any, __: any, { models: { User } }: Context) =>
      await User.find(),
  },
  Mutation: {},
};
