import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Plan } from './plans.model';
import { PendingPolicy } from '../policies/policies.model';
import { ProductsService } from '../products/products.service';
import { WalletService } from '../wallet/wallet.service';
import { PurchasePlanDto } from './purchase-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    private sequelize: Sequelize,

    @InjectModel(Plan) private planModel: typeof Plan,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,

    private productsService: ProductsService,
    private walletService: WalletService,
  ) {}

  async purchasePlan(purchasePlanDto: PurchasePlanDto) {
    return this.sequelize.transaction(async (transaction) => {
      const { customerId, productId, quantity } = purchasePlanDto;
      const product = await this.productsService.findById(productId);
      if (!product) throw new NotFoundException('Product not found');

      const totalPrice = product.price * quantity;

      // deduct wallet and create plan
      await this.walletService.deduct(customerId, totalPrice, transaction);
      const plan = await this.planModel.create(
        {
          customerId,
          productId,
          quantity,
          totalPrice,
        },
        { transaction },
      );

      // bulk create pending policies
      const pendingPolicies = Array.from({ length: quantity }).map(() => ({
        planId: plan.id,
      }));
      await this.pendingPolicyModel.bulkCreate(pendingPolicies, {
        transaction,
      });

      return plan;
    });
  }
}
