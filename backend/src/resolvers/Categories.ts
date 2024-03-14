import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../entities/Category";
import { validate } from "class-validator";

@Resolver(Category)
export class CategoriesResolver {
  @Query(() => [Category])
  async allCategories(): Promise<Category[]> {
    const categories = await Category.find({
      relations: { ads: true, image: true },
    });
    return categories;
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("id", () => ID) id: number): Promise<Category | null> {
    const category = await Category.findOne({
      where: { id: id },
      relations: { ads: true, image: true },
    });
    return category;
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CategoryCreateInput) data: CategoryCreateInput
  ): Promise<Category> {
    const newCategory = new Category();
    Object.assign(newCategory, data);

    const errors = await validate(newCategory);
    if (errors.length === 0) {
      await newCategory.save();
      return newCategory;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

  @Mutation(() => Category, { nullable: true })
  async updateCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: CategoryUpdateInput
  ): Promise<Category | null> {
    const category = await Category.findOne({
      where: { id: id },
    });
    if (category) {
      Object.assign(category, data);

      const errors = await validate(category);
      if (errors.length === 0) {
        await category.save();
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    }
    return category;
  }

  @Mutation(() => Category, { nullable: true })
  async deleteCategory(
    @Arg("id", () => ID) id: number
  ): Promise<Category | null> {
    const category = await Category.findOne({
      where: { id: id },
    });
    if (category) {
      await category.remove();
      category.id = id;
    }
    return category;
  }
}
