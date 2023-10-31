import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Tag, TagCreateInput, TagUpdateInput } from "../entities/Tag";
import { validate } from "class-validator";

@Resolver(Tag)
export class TagsResolver {
  @Query(() => [Tag])
  async allTags(): Promise<Tag[]> {
    const tags = await Tag.find({ relations: { ads: true } });
    return tags;
  }

  @Query(() => Tag, { nullable: true })
  async tag(@Arg("id", () => ID) id: number): Promise<Tag | null> {
    const tag = await Tag.findOne({
      where: { id: id },
      relations: { ads: true },
    });
    return tag;
  }

  @Mutation(() => Tag)
  async createTag(
    @Arg("data", () => TagCreateInput) data: TagCreateInput
  ): Promise<Tag> {
    const newTag = new Tag();
    Object.assign(newTag, data);

    const errors = await validate(newTag);
    if (errors.length === 0) {
      await newTag.save();
      return newTag;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

  @Mutation(() => Tag, { nullable: true })
  async updateTag(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: TagUpdateInput
  ): Promise<Tag | null> {
    const tag = await Tag.findOne({
      where: { id: id },
    });
    if (tag) {
      Object.assign(tag, data);

      const errors = await validate(tag);
      if (errors.length === 0) {
        await tag.save();
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    }
    return tag;
  }

  @Mutation(() => Tag, { nullable: true })
  async deleteTag(@Arg("id", () => ID) id: number): Promise<Tag | null> {
    const tag = await Tag.findOne({
      where: { id: id },
    });
    if (tag) {
      await tag.remove();
      tag.id = id;
    }
    return tag;
  }
}
