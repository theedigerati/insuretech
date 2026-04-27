import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActivatePendingPolicyDto } from './activate-pending-policy.dto';
import { PoliciesService } from './policies.service';
import { PolicyResponseDto } from './dtos/policy-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('policies')
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  /**
   * Fetch all active policies
   */
  @Get()
  async findAll(@Query('plan') plan: number): Promise<PolicyResponseDto[]> {
    const policies = await this.policiesService.findAll(plan);
    const plainPolicies = policies.map((p) => p.get({ plain: true }));
    return plainToInstance(PolicyResponseDto, plainPolicies, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Activate a pending policy, hence, creating a policy for a user (beneficiary)
   */
  @Post('activate')
  async activate(
    @Body() dto: ActivatePendingPolicyDto,
  ): Promise<PolicyResponseDto> {
    const policy = await this.policiesService.activatePendingPolicy(dto);
    return plainToInstance(PolicyResponseDto, policy.get({ plain: true }), {
      excludeExtraneousValues: true,
    });
  }
}
