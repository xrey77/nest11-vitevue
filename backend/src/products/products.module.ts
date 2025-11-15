import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { customProductRepositoryMethods } from './products.repository';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    AuthService,
    {
      provide: getRepositoryToken(Product),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(Product).extend(customProductRepositoryMethods);
      },
    },  

  ],
})
export class ProductsModule {}
