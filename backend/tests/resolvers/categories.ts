import { describe, expect, it } from "@jest/globals";
import { graphql, print } from "graphql";
import { TestArgs, mockContext } from "../common";
import { mutationCreateAd } from "../graphql/mutationCreateAd";
import { Ad } from "../../src/entities/Ad";
import { mutationCreateCategory } from "../graphql/mutationCreateCategory";
import { Category } from "../../src/entities/Category";

export default function (args: TestArgs) {
  describe("categories resolvers", () => {
    it("creates a new category", async () => {
      const mock = mockContext(args.data.token);
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationCreateCategory),
        variableValues: {
          data: {
            name: "All our bikes",
          },
        },
        contextValue: mock.context,
      })) as any;
      console.log(result.errors);
      expect(result.data.createCategory.id).toBe("1");
      const category = await Category.findOneBy({
        id: result.data.createCategory.id,
      });
      expect(!!category).toBe(true);
      args.data.categoryId = result.data.createCategory.id;
    });
  });
}
