import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchasePlanDto } from './dtos/purchase-plan.dto';
import { PlansService } from './plans.service';
import { PlanResponseDto } from './dtos/plan-response.dto';
import { plainToInstance } from 'class-transformer';
import { PendingPolicyResponseDto } from '../policies/dtos/pending-policy-response.dto';

@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  /**
   * Purchase an insurance product, hence, creating a plan
   */
  @Post()
  async purchasePlan(@Body() dto: PurchasePlanDto): Promise<PlanResponseDto> {
    const plan = await this.plansService.purchasePlan(dto);
    return plainToInstance(PlanResponseDto, plan.get({ plain: true }), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Fetch all plans
   */
  @Get()
  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.plansService.findAll();
    const plainPlans = plans.map((p) => p.get({ plain: true }));
    return plainToInstance(PlanResponseDto, plainPlans, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Fetch all pending policies under a plan
   */
  @Get(':id/pending-policies')
  async getPendingPolicies(
    @Param('id') id: number,
  ): Promise<PendingPolicyResponseDto[]> {
    const pendings = await this.plansService.getPendingPolicies(id);
    const plainPendings = pendings.map((p) => p.get({ plain: true }));
    return plainToInstance(PendingPolicyResponseDto, plainPendings, {
      excludeExtraneousValues: true,
    });
  }
}
