import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail, Matches } from "class-validator";
import {
  Authorized,
  Field,
  ID,
  InputType,
  ObjectType,
  UseMiddleware,
} from "type-graphql";
import { Ad } from "./Ad";
import { UserPrivateField } from "../utils";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 255, unique: true })
  @Authorized()
  @UseMiddleware(UserPrivateField)
  @Field()
  email!: string;

  @Column({ length: 255 })
  hashedPassword!: string;

  @OneToMany(() => Ad, (ad) => ad.createdBy)
  @Field(() => [Ad])
  ads!: Ad[];

  // role
}

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Matches(/^.{8,50}$/)
  password!: string;
}

/* 
@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  name!: string;
} */
