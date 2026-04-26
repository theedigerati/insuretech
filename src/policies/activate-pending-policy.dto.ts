import { IsInt } from 'class-validator';

export class ActivatePendingPolicyDto {
  @IsInt()
  pendingPolicyId: number;

  @IsInt()
  beneficiaryId: number;
}
