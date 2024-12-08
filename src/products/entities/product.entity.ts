import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    // unique: true, No se porque no funciona
  })
  title: string;

  @Column('numeric', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column(
    'text',
    // { unique: true }
  )
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  // ESTO DEBERIA TENER RELACION CON OTRA TABLA
  @Column('text', {
    // array: true,
  })
  size: string;

  @Column()
  gender: string;

  //tags
  //images
}
