import { Injectable } from '@nestjs/common';
import { PageDto } from './dto/page.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productsRepository, options);
  }

  async findAllPaginated(page: number): Promise<PageDto<Product>> {
    let limit: number = 5;
    let offset: number = Math.ceil((page - 1) * limit);
    let skip: number = offset;
   
    const [result, totalItems] = await this.productsRepository.findAndCount({
      select: ['id','descriptions','qty','unit','sellprice','productpicture'],
      take: limit,
      skip: skip,
      order: { id: "ASC" },
    });

    return new PageDto<Product>(result, totalItems, page!, limit!);
  }

  async findSearchPaginated(page: number, keyword: string): Promise<PageDto<Product>> {
    let limit: number = 5;
    let offset: number = Math.ceil((page - 1) * limit);

    let skip: number = offset;
    const [result, totalItems] = await this.productsRepository.findAndCount({
      select: ['id','descriptions','qty','unit','sellprice','productpicture'],
      take: limit,
      skip: skip,
      where: { descriptions: ILike(`%${keyword}%`) },
      order: { id: "ASC" },
    });

    return new PageDto<Product>(result, totalItems, page!, limit!);
  }


}
