import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { WalletService } from './wallet.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
