import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActivatePendingPolicyDto } from './activate-pending-policy.dto';
import { PoliciesService } from './policies.service';
import { Policy } from './policies.model';

@Controller('policies')
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  @Get()
  findAll(@Query('plan') plan: number): Promise<Policy[]> {
    return this.policiesService.findAll(plan);
  }

  @Post('activate')
  activate(@Body() dto: ActivatePendingPolicyDto) {
    return this.policiesService.activatePendingPolicy(dto);
  }
}
