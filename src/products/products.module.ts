import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product, ProductCategory } from './products.model';
import { ProductsService } from './products.service';

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductCategory])],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
