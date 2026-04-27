import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductResponseDto } from './dtos/product-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  /**
   * Fetch all available insurance products
   */
  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findAll();
    const plainProducts = products.map((p) => p.get({ plain: true }));
    return plainToInstance(ProductResponseDto, plainProducts, {
      excludeExtraneousValues: true,
    });
  }
}
