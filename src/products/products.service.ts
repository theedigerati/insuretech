import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductCategory } from './products.model';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product) private productModel: typeof Product) {}

  async findById(id: number) {
    return this.productModel.findByPk(id);
  }

  async findAll() {
    return this.productModel.findAll({
      include: [ProductCategory],
    });
  }
}
