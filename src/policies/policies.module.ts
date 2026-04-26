import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicy, Policy } from './policies.model';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Policy, PendingPolicy]), UsersModule],
  providers: [PoliciesService],
  controllers: [PoliciesController],
})
export class PoliciesModule {}
