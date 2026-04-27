import { Server } from 'http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestDatabaseModule } from './utils/db.module';
import { seedBasicData } from './utils/seed';
import { Plan } from '../src/plans/plans.model';
import { PendingPolicy } from '../src/policies/policies.model';
import { User } from '../src/users/users.model';
import { UsersModule } from '../src/users/users.module';
import { ProductsModule } from '../src/products/products.module';
import { WalletModule } from '../src/wallet/wallet.module';
import { PlansModule } from '../src/plans/plans.module';
import { PoliciesModule } from '../src/policies/policies.module';
import { Sequelize } from 'sequelize';
import { getConnectionToken } from '@nestjs/sequelize';

jest.mock('nanoid', () => ({ nanoid: () => crypto.randomUUID() }));

describe('Plans API (e2e)', () => {
  let app: INestApplication<Server>;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        PoliciesModule,
        PlansModule,
        ProductsModule,
        UsersModule,
        WalletModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // perform manual sync
    const sequelize = app.get<Sequelize>(getConnectionToken());
    await sequelize.sync({ force: true });

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // clears data but keeps table structure
    const sequelize = app.get<Sequelize>(getConnectionToken());
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    await sequelize.truncate();
    await sequelize.query('PRAGMA foreign_keys = ON;');
  });

  it('should purchase a plan and create pending policies', async () => {
    const { userA, product } = await seedBasicData();

    const res = await request(httpServer)
      .post('/plans')
      .send({
        customerId: userA.id,
        productId: product.id,
        quantity: 3,
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');

    // verify pending policies created
    const pendingPolicies = await PendingPolicy.findAll();
    expect(pendingPolicies.length).toBe(3);

    // verify wallet deducted
    const updatedUser = await User.findByPk(userA.id);
    expect(updatedUser?.walletBalance).toBe(70_000);
  });

  it('should fetch all plans', async () => {
    const { userA, product } = await seedBasicData();

    await request(httpServer)
      .post('/plans')
      .send({
        customerId: userA.id,
        productId: product.id,
        quantity: 3,
      })
      .expect(201);

    const res = await request(httpServer).get('/plans').expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body).toHaveProperty([0, 'quantity'], 3);
    expect(res.body).toHaveProperty([0, 'product', 'id'], product.id);
  });

  it('should fetch pending policies under a plan', async () => {
    const { userA, product } = await seedBasicData();

    await request(httpServer)
      .post('/plans')
      .send({
        customerId: userA.id,
        productId: product.id,
        quantity: 3,
      })
      .expect(201);

    const plan = await Plan.findOne();

    const res = await request(httpServer)
      .get(`/plans/${plan?.id}/pending-policies`)
      .expect(200);

    expect(res.body).toHaveLength(3);
    expect(res.body).toHaveProperty([0, 'status'], 'unused');
  });

  it('should fail if wallet balance is insufficient', async () => {
    const { userB, product } = await seedBasicData();

    await request(app.getHttpServer())
      .post('/plans')
      .send({
        customerId: userB.id,
        productId: product.id,
        quantity: 1,
      })
      .expect(400);
  });
});
