import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest';
import { execSync } from "node:child_process"
import request from 'supertest';
import { app } from '../src/app';

beforeAll(async () => {
  await app.ready();
})

afterAll(async () => {
  await app.close();
})

beforeEach(() => {
  execSync("npm run knex migrate:rollback --all")
  execSync("npm run knex migrate:latest")
})

describe('Transactions routes', () => {
  it("should be able to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit"
      })
      .expect(201)
  })

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction 2",
        amount: 5000,
        type: "credit"
      })

      const cookies: any = createTransactionResponse.get('Set-Cookie');

      const listTransactionsRespose = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookies)
        .expect(200)

        expect(listTransactionsRespose.body.transactions).toEqual([
          expect.objectContaining({
            title: "New Transaction 2",
            amount: 5000
          })
        ])
  })

  it("should be able to get specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction 2",
        amount: 5000,
        type: "credit"
      })

      const cookies: any = createTransactionResponse.get('Set-Cookie');

      const listTransactionsRespose = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookies)
        .expect(200)

      const transactionId = listTransactionsRespose.body.transactions[0].id;

      const getTransactionResponse = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set("Cookie", cookies)
        .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual(
          expect.objectContaining({
            title: "New Transaction 2",
            amount: 5000
          })
        )
  })

  it("should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Credit Transaction",
        amount: 5000,
        type: "credit"
      })

      const cookies: any = createTransactionResponse.get('Set-Cookie');

      await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit Transaction",
        amount: 1350,
        type: "debit"
      })

      const summaryResponse = await request(app.server)
        .get("/transactions/summary")
        .set("Cookie", cookies)
        .expect(200)

        expect(summaryResponse.body.summary).toEqual({
          amount: 3650
        })
  })
})

