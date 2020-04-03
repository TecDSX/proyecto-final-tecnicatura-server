import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from '../graphql/resolvers/index';
import { typeDefs } from '../graphql/typeDefs/index';
import { config } from '../config';
import { createConnection } from '../database';
import { User } from '../models/User';
const {
  server: { port },
} = config;
export const models = {
  User,
};
const graphqlServer = new GraphQLServer({
  resolvers,
  typeDefs,
  context: { models },
});
export const main = async (): Promise<void> => {
  await createConnection();
  console.log(`DataBase is connected`);
  await graphqlServer.start(
    {
      port: port,
    },
    ({ port }) => {
      console.log(`Server running on port ${port}`);
    }
  );
};
