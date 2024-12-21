import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll() {
    return await this.productRepository.find({});
  }

  async findOne(id: string) {
    const Product = await this.productRepository.findOneBy({ id });

    if (!Product) throw new NotFoundException(`Product #${id} not found`);

    return Product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
