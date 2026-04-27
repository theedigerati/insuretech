import { Expose, Type } from 'class-transformer';

export class PolicyPlanDto {
  @Expose()
  id: number;

  @Expose()
  quantity: string;

  @Expose()
  totalPrice: number;
}

export class PendingPolicyResponseDto {
  @Expose()
  id: number;

  @Type(() => PolicyPlanDto)
  @Expose()
  plan: PolicyPlanDto;
}
