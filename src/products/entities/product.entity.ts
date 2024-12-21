import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //  FORMA DIFERENTE DE DECLAR EN TYPEORM
  @Column({
    type: 'varchar',
    unique: true, //No se porque no funciona
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
  size: string;

  @Column()
  gender: string;

  //tags
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
}
