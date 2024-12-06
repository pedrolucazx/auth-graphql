import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers, typeDefs } from './graphql/index';
import { ListenOptions } from 'net';
import { Knex } from 'knex';

interface ServerStart {
  server: ApolloServer;
  url: string;
}

async function startApolloServer(
  database: Knex,
  listenOptions: ListenOptions = { port: 4000 },
): Promise<ServerStart> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: listenOptions,
    context: async () => ({ database }),
  });

  return { server, url };
}

export default startApolloServer;
