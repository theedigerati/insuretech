import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchasePlanDto } from './purchase-plan.dto';
import { PlansService } from './plans.service';
import { PendingPolicy } from '../policies/policies.model';
import { Plan } from './plans.model';

@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Post()
  purchasePlan(@Body() dto: PurchasePlanDto): Promise<Plan> {
    return this.plansService.purchasePlan(dto);
  }

  @Get()
  findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  @Get(':id/pending-policies')
  getPendingPolicies(@Param('id') id: number): Promise<PendingPolicy[]> {
    return this.plansService.getPendingPolicies(id);
  }
}
