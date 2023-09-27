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

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(3, 100)
  title!: string;

  @Column()
  @IsInt()
  price!: number;

  @Column()
  imgUrl!: string;

  @Column({ nullable: true })
  @Length(0, 5000)
  @ValidateIf((object, value) => !!value)
  description!: string;

  @ManyToOne(() => Category, (category) => category.ads)
  category!: Category;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  // check with SQLite extension! If you forget this following line, the
  // pivot table won't be generated
  @JoinTable()
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;
}
