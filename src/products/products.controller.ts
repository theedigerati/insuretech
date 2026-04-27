import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  /**
   * Fetch all available insurance products
   */
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
