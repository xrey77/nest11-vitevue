import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";

export interface ProductRepository extends Repository<Product> {
  this: Repository<Product>;
  listProduct(): Promise<Product | null>;
  productSearch(descriptions: string): Promise<Product | null>;
}

export const customProductRepositoryMethods: Pick<ProductRepository,
'listProduct' | 'productSearch'> = {
  listProduct() {
    return this.findAll();
  },
  productSearch(this: Repository<Product>, descriptions: string) {
    return this.findOneBy({ descriptions });
  },
};



