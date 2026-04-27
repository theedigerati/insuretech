import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PendingPolicy, Policy } from './policies.model';
import { Plan } from '../plans/plans.model';
import { UsersService } from '../users/users.service';
import { ActivatePendingPolicyDto } from './activate-pending-policy.dto';
import { nanoid } from 'nanoid';
import { Product } from '../products/products.model';
import { User } from '../users/users.model';

@Injectable()
export class PoliciesService {
  constructor(
    private sequelize: Sequelize,

    @InjectModel(Policy) private policyModel: typeof Policy,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,

    private usersService: UsersService,
  ) {}

  async activatePendingPolicy(
    activatePendingPolicyDto: ActivatePendingPolicyDto,
  ) {
    const { pendingPolicyId, beneficiaryId } = activatePendingPolicyDto;

    return this.sequelize.transaction(async (transaction) => {
      // lock the pending policy row
      const pending = await this.pendingPolicyModel.findOne({
        where: { id: pendingPolicyId },
        include: [Plan],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!pending) throw new NotFoundException('Pending policy not found');

      if (pending.status === 'used') {
        throw new BadRequestException('Pending policy already used');
      }

      const user = await this.usersService.findById(beneficiaryId);
      if (!user) throw new NotFoundException('Beneficiary user not found');

      const productId = pending.plan.productId;

      // enforce uniqueness
      const existing = await this.policyModel.findOne({
        where: {
          beneficiaryId,
          productId,
        },
        transaction,
      });

      if (existing) {
        throw new ConflictException(
          'Beneficiary user already has a policy for this product',
        );
      }

      // create policy
      const policyNumber = nanoid(21);
      const policy = await this.policyModel.create(
        {
          beneficiaryId,
          productId,
          planId: pending.planId,
          policyNumber,
        },
        { transaction, include: [User, Plan, Product] },
      );

      pending.status = 'used';
      await pending.destroy({ transaction });

      return policy;
    });
  }

  async findAll(planId?: number) {
    return this.policyModel.findAll({
      where: planId ? { planId } : undefined,
      include: [Plan, Product, User],
    });
  }
}
