import { describe, expect, it } from "@jest/globals";
import { graphql, print } from "graphql";
import { mutationSignup } from "../graphql/mutationSignup";
import { User } from "../../src/entities/User";
import { TestArgs, mockContext } from "../common";
import { queryMe } from "../graphql/queryMe";
import { mutationSignin } from "../graphql/mutationSignin";

export default function (args: TestArgs) {
  describe("users resolvers", () => {
    it("creates a new user", async () => {
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationSignup),
        variableValues: {
          data: {
            email: "test1@gmail.com",
            password: "supersecret",
          },
        },
      })) as any;
      expect(result.data.signup.id).toBe("1");
      const user = await User.findOneBy({ id: result.data.signup.id });
      expect(!!user).toBe(true);
      expect(user?.hashedPassword !== "supersecret").toBe(true);
    });
    it("cannot creates the same user", async () => {
      const result = (await graphql({
        schema: args.schema,
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
        schema: args.schema,
        source: print(mutationSignin),
        variableValues: {
          email: "test1@gmail.com",
          password: "supersecret",
        },
        contextValue: mock.context,
      })) as any;
      expect(result.data.signin.id).toBe("1");
      expect(!!mock.token).toBe(true);
      args.data.token = mock.token;
      args.data.userId = result.data.signin.id;
    });
    it("returns null if not connected", async () => {
      const mock = mockContext();
      const result = (await graphql({
        schema: args.schema,
        source: print(queryMe),
        contextValue: mock.context,
      })) as any;
      expect(result.data.me).toBeNull();
    });
    it("returns the profile if connected", async () => {
      const mock = mockContext(args.data.token);
      const result = (await graphql({
        schema: args.schema,
        source: print(queryMe),
        contextValue: mock.context,
      })) as any;
      expect(result.data.me.id).toBeTruthy();
      expect(result.data.me.email).toBeTruthy();
    });
  });
}
