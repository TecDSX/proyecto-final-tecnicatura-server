import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from '../graphql/resolvers';
import { typeDefs } from '../graphql/typeDefs';
import { config } from '../config';
import { createConnection } from '../database';
import { context } from '../graphql/context';
import { autoComplete } from '../utils/utils';

const {
  server: { port },
} = config;
const graphqlServer = new GraphQLServer({
  resolvers,
  typeDefs,
  context,
});
export const main = async (): Promise<void> => {
  await createConnection();
  autoComplete();
  await graphqlServer.start({ port });
  console.log(`Server running at port ${port}`);
};
