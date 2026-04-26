import { Body, Controller, Post } from '@nestjs/common';
import { ActivatePendingPolicyDto } from './activate-pending-policy.dto';
import { PoliciesService } from './policies.service';

@Controller('policies')
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  @Post('activate')
  activate(@Body() dto: ActivatePendingPolicyDto) {
    return this.policiesService.activatePendingPolicy(dto);
  }
}
