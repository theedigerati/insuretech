import { Expose, Type } from 'class-transformer';
import { PolicyPlanDto } from './pending-policy-response.dto';

class BeneficiaryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

class PolicyProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class PolicyResponseDto {
  @Expose()
  id: number;

  @Type(() => PolicyPlanDto)
  @Expose()
  plan: PolicyPlanDto;

  @Type(() => PolicyProductDto)
  @Expose()
  product: PolicyProductDto;

  @Type(() => BeneficiaryDto)
  @Expose()
  beneficiary: BeneficiaryDto;

  @Expose()
  policyNumber: string;
}
