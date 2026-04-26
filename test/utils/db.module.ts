import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicy, Policy } from '../../src/policies/policies.model';
import { Product, ProductCategory } from '../../src/products/products.model';
import { User } from '../../src/users/users.model';
import { Plan } from '../../src/plans/plans.model';

export const TestDatabaseModule = SequelizeModule.forRoot({
  dialect: 'sqlite',
  storage: ':memory:',
  autoLoadModels: false,
  models: [User, ProductCategory, Product, Plan, PendingPolicy, Policy],
  synchronize: true,
  logging: false,
});
