import { describe, expect, it } from "@jest/globals";
import { graphql, print } from "graphql";
import { TestArgs, mockContext } from "../common";
import { mutationCreateAd } from "../graphql/mutationCreateAd";
import { Ad } from "../../src/entities/Ad";
import { queryAd } from "../graphql/queryAd";

export default function (args: TestArgs) {
  describe("ads resolvers", () => {
    it("creates a new ad", async () => {
      const mock = mockContext(args.data.token);
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationCreateAd),
        variableValues: {
          data: {
            title: "Super bike",
            description: "This is a super bike",
            imgUrl: "https://google.com/someimage.png",
            price: 10000,
            category: { id: args.data.categoryId },
            tags: [],
          },
        },
        contextValue: mock.context,
      })) as any;
      expect(result.data.createAd.id).toBe("1");
      const ad = await Ad.findOneBy({ id: result.data.createAd.id });
      expect(!!ad).toBe(true);
      args.data.adId = result.data.createAd.id;
    });
    it("returns the ad with the author", async () => {
      const mock = mockContext(args.data.token);
      const result = (await graphql({
        schema: args.schema,
        source: print(queryAd),
        variableValues: {
          id: args.data.adId,
        },
        contextValue: mock.context,
      })) as any;
      expect(result.data.ad.title).toBe("Super bike");
      expect(result.data.ad.createdBy.id).toBe(args.data.userId);
    });
  });
}
