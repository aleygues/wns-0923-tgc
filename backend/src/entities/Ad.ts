import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Length, ValidateIf, IsInt } from "class-validator";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { ObjectId } from "./ObjectId";
import { User } from "./User";
import { computeDistanceInSeconds } from "../helpers";

@Entity()
@ObjectType()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Length(3, 100)
  @Field()
  title!: string;

  @Column()
  @IsInt()
  @Field()
  price!: number;

  @Column()
  @Field()
  imgUrl!: string;

  @Column({ nullable: true })
  @Length(0, 5000)
  @ValidateIf((object, value) => !!value)
  @Field()
  description!: string;

  @ManyToOne(() => Category, (category) => category.ads)
  @Field(() => Category, { nullable: true })
  category!: Category;

  @ManyToMany(() => Tag, (tag) => tag.ads, { cascade: ["remove"] })
  // check with SQLite extension! If you forget this following line, the
  // pivot table won't be generated
  @JoinTable()
  @Field(() => [Tag])
  tags!: Tag[];

  @Field(() => Int)
  get onlineSince() {
    return computeDistanceInSeconds(this.createdAt, new Date());
  }

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.ads)
  @Field(() => User)
  createdBy!: User;
}

@InputType()
export class AdCreateInput {
  @Field()
  title!: string;

  @Field(() => Int)
  price!: number;

  @Field()
  imgUrl!: string;

  @Field()
  description!: string;

  @Field()
  category!: ObjectId;

  @Field(() => [ObjectId])
  tags!: ObjectId[];
}

@InputType()
export class AdUpdateInput {
  @Field({ nullable: true })
  title!: string;

  @Field(() => Int, { nullable: true })
  price!: number;

  @Field({ nullable: true })
  imgUrl!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  category!: ObjectId;

  @Field(() => [ObjectId], { nullable: true })
  tags!: ObjectId[];
}

@InputType()
export class AdsWhere {
  @Field(() => [ID], { nullable: true })
  categoryIn?: number[];

  @Field(() => String, { nullable: true })
  searchTitle?: string;

  @Field(() => Int, { nullable: true })
  priceGte?: number;

  @Field(() => Int, { nullable: true })
  priceLte?: number;
}
