import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategory } from '../products/products.model';

@Injectable()
export class ProductCategorySeeder {
  constructor(
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory,
  ) {}

  async run(): Promise<void> {
    const categories = [{ name: 'Health' }, { name: 'Auto' }];

    for (const category of categories) {
      await this.productCategoryModel.findOrCreate({
        where: { name: category.name },
        defaults: category,
      });
    }

    console.log('✅ Product categories seeded');
  }
}
