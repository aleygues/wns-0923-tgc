import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { GraphQLSchema, graphql, print } from "graphql";
import { getSchema } from "../src/schema";
import { dataSourceOptions } from "../src/datasource";
import { DataSource } from "typeorm";
import { mutationSignup } from "./graphql/mutationSignup";
import { mutationSignin } from "./graphql/mutationSignin";

let schema: GraphQLSchema;
let dataSource: DataSource;

beforeAll(async () => {
  schema = await getSchema();

  dataSource = new DataSource({
    ...dataSourceOptions,
    host: "127.0.0.1",
    port: 5433,
    username: "superuser",
    password: "supersecret",
    database: "thegoodcorner",
    dropSchema: true,
  });

  await dataSource.initialize();
});

afterAll(() => {
  dataSource.destroy();
});

describe("users resolvers", () => {
  it("creates a new user", async () => {
    const result = (await graphql({
      schema,
      source: print(mutationSignup),
      variableValues: {
        data: {
          email: "test1@gmail.com",
          password: "supersecret",
        },
      },
    })) as any;
    expect(result?.data?.signup?.id).toBe("1");
  });
  it("cannot creates the same user", async () => {
    const result = (await graphql({
      schema,
      source: print(mutationSignup),
      variableValues: {
        data: {
          email: "test1@gmail.com",
          password: "supersecret",
        },
      },
    })) as any;
    expect(!!result.errors).toBe(true);
  });
  it("sign in with the user", async () => {
    const result = (await graphql({
      schema,
      source: print(mutationSignin),
      variableValues: {
        email: "test1@gmail.com",
        password: "supersecret",
      },
    })) as any;
    console.log(result);
    expect(result?.data?.signin?.id).toBe("1");
  });
  // test get me
});
