import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from '../graphql/resolvers/index';
import { typeDefs } from '../graphql/typeDefs/index';
const graphqlServer = new GraphQLServer({
  resolvers,
  typeDefs,
});
export const main = async (): Promise<void> => {
  await graphqlServer.start(
    {
      port: 5000,
    },
    ({ port }) => {
      console.log(`Server running on port ${port}`);
    }
  );
};
