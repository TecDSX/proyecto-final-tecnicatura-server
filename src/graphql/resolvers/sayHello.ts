// eslint-disable-next-line no-unused-vars
import { iSayHelloInput, iSayHello } from '../../interfaces/index';
export default {
  Query: {
    sayHello(_: any, { input: { name } }: iSayHelloInput, __: any): iSayHello {
      return {
        message: `Hello ${name || 'World'}`,
      };
    },
  },
};
