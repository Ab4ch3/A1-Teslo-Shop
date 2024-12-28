import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      await this.productRepository.save(newProduct);

      return newProduct;
    } catch (e) {
      this.handleDBExceptions(e);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO :: RELACIONES
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      //le estas especifando valor que luego se le pasaran , esto es una medida contra slq injection
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!product) throw new NotFoundException(`Product #${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // preload , buscar el producto y q cargue todas las que estan definidas en la data.
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) throw new NotFoundException(`Product #${id} not found`);

    try {
      await this.productRepository.save(product);

      return product;
    } catch (e) {
      this.handleDBExceptions(e);
    }
  }

  async remove(id: string) {
    const Product = await this.productRepository.findOneBy({ id });

    if (!Product) throw new NotFoundException(`Product #${id} not found`);

    await this.productRepository.remove(Product);

    return 'Product Deleted';
  }

  private handleDBExceptions(error: any) {
    if (error.errno === 1062) {
      throw new BadRequestException(error.sqlMessage);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      `Unexpected error, check server logs`,
    );
  }
}
