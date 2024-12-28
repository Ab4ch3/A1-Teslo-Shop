import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //  FORMA DIFERENTE DE DECLAR EN TYPEORM
  @Column({
    type: 'varchar',
    unique: true,
    length: 150,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column(
    'varchar',
    // { unique: true }
  )
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  // ESTO DEBERIA TENER RELACION CON OTRA TABLA
  @Column('varchar', {
    // array: true,
  })
  sizes: string;

  @Column()
  gender: string;

  @Column({
    type: 'varchar',
    // array: true,
    default: '',
  })
  tags: string;
  //images

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
