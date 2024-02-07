import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { GraphQLSchema, graphql, print } from "graphql";
import { getSchema } from "../src/schema";
import { dataSourceOptions } from "../src/datasource";
import { DataSource } from "typeorm";
import { mutationSignup } from "./graphql/mutationSignup";
import { mutationSignin } from "./graphql/mutationSignin";
import { User } from "../src/entities/User";
import { serialize, parse } from "cookie";
import { queryMe } from "./graphql/queryMe";

function mockContext(token?: string) {
  const value: { context: any; token?: string } = {
    token,
    context: {
      req: {
        headers: {
          cookie: token ? serialize("token", token) : undefined,
        },
        connection: { encrypted: false },
      },
      res: {
        getHeader: () => "",
        setHeader: (key: string, cookieValue: string | string[]) => {
          if (key === "Set-Cookie") {
            const parsedValue = parse(
              Array.isArray(cookieValue) ? cookieValue[0] : cookieValue
            );
            if (parsedValue.token) {
              value.token = parsedValue.token;
            }
          }
        },
        headers: {},
      },
    },
  };
  return value;
}

let schema: GraphQLSchema;
let dataSource: DataSource;
let token: string | undefined;

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
    logging: false,
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
    const user = await User.findOneBy({ id: result?.data?.signup?.id });
    expect(!!user).toBe(true);
    expect(user?.hashedPassword !== "supersecret").toBe(true);
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
    const mock = mockContext();
    const result = (await graphql({
      schema,
      source: print(mutationSignin),
      variableValues: {
        email: "test1@gmail.com",
        password: "supersecret",
      },
      contextValue: mock.context,
    })) as any;
    expect(result?.data?.signin?.id).toBe("1");
    expect(!!mock.token).toBe(true);
    token = mock.token;
  });
  it("returns null if not connected", async () => {
    const mock = mockContext();
    const result = (await graphql({
      schema,
      source: print(queryMe),
      contextValue: mock.context,
    })) as any;
    expect(result?.data?.me).toBeNull();
  });
  it("returns the profile if connected", async () => {
    const mock = mockContext(token);
    const result = (await graphql({
      schema,
      source: print(queryMe),
      contextValue: mock.context,
    })) as any;
    expect(result?.data?.me.id).toBeTruthy();
    expect(result?.data?.me.email).toBeTruthy();
  });
});
