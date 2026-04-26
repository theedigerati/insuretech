import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { User } from '../users/users.model';

@Injectable()
export class WalletService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async deduct(userId: number, amount: number, transaction: Transaction) {
    const user = await this.userModel.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.walletBalance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    user.walletBalance = user.walletBalance - amount;
    await user.save({ transaction });

    return user;
  }
}
