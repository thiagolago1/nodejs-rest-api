import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/hello', async () => {
  const testTables = await knex('sqlite_schema').select('*');
  return testTables;
});

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
});
