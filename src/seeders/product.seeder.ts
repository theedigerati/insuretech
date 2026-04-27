import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductCategory } from '../products/products.model';

@Injectable()
export class ProductSeeder {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory,
  ) {}

  async run(): Promise<void> {
    const health = await this.productCategoryModel.findOne({
      where: { name: 'Health' },
    });
    const auto = await this.productCategoryModel.findOne({
      where: { name: 'Auto' },
    });
    if (!health || !auto) return;

    const products = [
      { name: 'Optimal Care Mini', price: 10000, categoryId: health.id },
      { name: 'Optimal Care Standard', price: 20000, categoryId: health.id },
      { name: 'Third Party', price: 5000, categoryId: auto.id },
      { name: 'Comprehensive', price: 15000, categoryId: auto.id },
    ];

    for (const product of products) {
      await this.productModel.findOrCreate({
        where: { name: product.name },
        defaults: product,
      });
    }

    console.log('✅ Products seeded');
  }
}
