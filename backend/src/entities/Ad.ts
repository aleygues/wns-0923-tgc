import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  @Length(10, 100)
  title!: string;

  @Column()
  @Length(0, 5000)
  description!: string;
}
