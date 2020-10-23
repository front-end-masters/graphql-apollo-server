import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { BookResolver } from './resolvers/book.resolver';

async function bootServer() {
  const connection = await createConnection();
  const schema = await buildSchema({
    resolvers: [BookResolver]
  });
  const server = new ApolloServer({ schema });
  const { url } = await server.listen(process.env.PORT || 4000);
  console.log(`🚀 Server ready at ${url}`);
}

bootServer();
