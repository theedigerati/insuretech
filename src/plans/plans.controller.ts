import { Body, Controller, Post } from '@nestjs/common';
import { PurchasePlanDto } from './purchase-plan.dto';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Post()
  purchasePlan(@Body() dto: PurchasePlanDto) {
    return this.plansService.purchasePlan(dto);
  }
}
