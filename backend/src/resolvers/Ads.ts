import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Ad, AdInput } from "../entities/Ad";
import { validate } from "class-validator";

@Resolver(Ad)
export class AdsResolver {
  @Query(() => [Ad])
  async allAds(): Promise<Ad[]> {
    const ads = await Ad.find({ relations: { category: true, tags: true } });
    console.log(ads);
    return ads;
  }

  @Mutation(() => Ad)
  async createAd(@Arg("data", () => AdInput) data: AdInput): Promise<Ad> {
    const newAd = new Ad();
    Object.assign(newAd, data);

    const errors = await validate(newAd);
    if (errors.length === 0) {
      await newAd.save();
      return newAd;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }
}
