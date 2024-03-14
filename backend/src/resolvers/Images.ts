import { Query, Resolver } from "type-graphql";
import { Image } from "../entities/Image";

@Resolver(Image)
export class ImagesResolver {
  @Query(() => [Image])
  async allImages(): Promise<Image[]> {
    const images = await Image.find({});
    return images;
  }
}
