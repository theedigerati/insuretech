import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './plans.model';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { PendingPolicy } from '../policies/policies.model';
import { ProductsModule } from '../products/products.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Plan, PendingPolicy]),
    ProductsModule,
    WalletModule,
  ],
  providers: [PlansService],
  controllers: [PlansController],
})
export class PlansModule {}
