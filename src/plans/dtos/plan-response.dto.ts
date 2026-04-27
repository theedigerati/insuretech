import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../products/dtos/product-response.dto';

class CustomerDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class PlanResponseDto {
  @Expose()
  id: number;

  @Type(() => CustomerDto)
  @Expose()
  customer: CustomerDto;

  @Type(() => ProductResponseDto)
  @Expose()
  product: ProductResponseDto;

  @Expose()
  quantity: number;

  @Expose()
  totalPrice: number;
}
