import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Length } from "class-validator";
import { Ad } from "./Ad";
import { Field, ID, ObjectType, InputType } from "type-graphql";
import { Image } from "./Image";
import { ObjectId } from "./ObjectId";

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 100 })
  @Length(10, 100)
  @Field()
  name!: string;

  @ManyToOne(() => Image)
  @Field()
  image!: Image;

  @OneToMany(() => Ad, (ad) => ad.category)
  @Field(() => [Ad])
  ads!: Ad[];
}

@InputType()
export class CategoryCreateInput {
  @Field()
  name!: string;

  @Field()
  image!: ObjectId;
}

@InputType()
export class CategoryUpdateInput {
  @Field({ nullable: true })
  name!: string;

  @Field()
  image!: ObjectId;
}
