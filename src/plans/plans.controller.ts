import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchasePlanDto } from './purchase-plan.dto';
import { PlansService } from './plans.service';
import { PendingPolicy } from '../policies/policies.model';
import { Plan } from './plans.model';

@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  /**
   * Purchase an insurance product hence, creating a Plan
   */
  @Post()
  purchasePlan(@Body() dto: PurchasePlanDto): Promise<Plan> {
    return this.plansService.purchasePlan(dto);
  }

  /**
   * Fetch all plans
   */
  @Get()
  findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  /**
   * Fetch all pending policies under a plan
   */
  @Get(':id/pending-policies')
  getPendingPolicies(@Param('id') id: number): Promise<PendingPolicy[]> {
    return this.plansService.getPendingPolicies(id);
  }
}
