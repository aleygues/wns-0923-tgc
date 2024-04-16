import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({})
  @Field()
  mimetype!: string;

  @Column({})
  path!: string;

  @Column({})
  originalName!: string;

  @Field()
  get uri(): string {
    return `/api/images/${this.id}`;
  }
}
