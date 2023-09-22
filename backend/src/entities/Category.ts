import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  @Length(10, 100)
  name!: string;
}
