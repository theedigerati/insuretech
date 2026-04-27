import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductCategorySeeder } from './product-category.seeder';
import { ProductSeeder } from './product.seeder';
import { UserSeeder } from './users.seeder';
import { Product, ProductCategory } from '../products/products.model';
import { User } from '../users/users.model';

@Module({
  imports: [SequelizeModule.forFeature([ProductCategory, Product, User])],
  providers: [ProductCategorySeeder, ProductSeeder, UserSeeder],
})
export class SeederModule {}
