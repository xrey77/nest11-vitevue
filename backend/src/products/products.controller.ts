import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PageDto } from './dto/page.dto';
import { Product } from './entities/product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //Another way of Pagination
  //syntax : http://localhost:3000/api/products/pagination?page=1
  @Get('pagination')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ): Promise<Pagination<Product>> {
    let limit: number = 5;
    return this.productsService.paginate({
      page,
      limit,
    });
  }

  //syntax: http://localhost:3000/api/products/list?page=1
  @Get('list/:page')
  async findAll(@Param('page')page: number): Promise<PageDto<Product>> {
      return this.productsService.findAllPaginated(page);
  }

  //syntax : http://localhost:3000/api/products/productsearch?page=1&keyword=cineo
  @Get('search/:page/:keyword')
  async findSearch(@Param('page')page: number, @Param('keyword')keyword: string, ): Promise<PageDto<Product>> {
      return this.productsService.findSearchPaginated(page,keyword);
  }

}
