import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column()
  description!: string;

  constructor(value?: { title: string; description: string }) {
    super();

    if (value) {
      this.title = value?.title;
      this.description = value?.description;
    }
  }
}
