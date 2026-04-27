import { Expose, Type } from 'class-transformer';

class ProductCategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Type(() => ProductCategoryDto)
  @Expose()
  category: ProductCategoryDto;

  @Expose()
  price: number;
}
