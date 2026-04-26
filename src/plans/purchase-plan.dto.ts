import { IsInt } from 'class-validator';

export class PurchasePlanDto {
  @IsInt()
  customerId: number;

  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}
