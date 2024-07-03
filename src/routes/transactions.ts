import { FastifyInstance } from "fastify";
import { knex } from "../database";
import crypto from 'node:crypto';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    // const transaction = await knex("transactions").insert({
    //   id: crypto.randomUUID(),
    //   title: "Transação de teste",
    //   amount: 1000
    // })
    // .returning("*")

    // return transaction

    // const transactions = await knex("transactions").select("*");
    // return transactions;

    const transactions = await knex("transactions").where("amount", 1000).select("*")
    return transactions;
  });
}