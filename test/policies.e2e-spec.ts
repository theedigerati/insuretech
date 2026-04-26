import { Server } from 'http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestDatabaseModule } from './utils/db.module';
import { seedBasicData } from './utils/seed';
import { PendingPolicy, Policy } from '../src/policies/policies.model';
import { User } from '../src/users/users.model';
import { UsersModule } from '../src/users/users.module';
import { ProductsModule } from '../src/products/products.module';
import { WalletModule } from '../src/wallet/wallet.module';
import { PlansModule } from '../src/plans/plans.module';
import { PoliciesModule } from '../src/policies/policies.module';
import { Sequelize } from 'sequelize';
import { getConnectionToken } from '@nestjs/sequelize';

jest.mock('nanoid', () => ({ nanoid: () => crypto.randomUUID() }));

describe('Policies API (e2e)', () => {
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

  it('should activate a pending policy for another user', async () => {
    const { userA, userB, product } = await seedBasicData();

    // purchase plan
    await request(app.getHttpServer()).post('/plans').send({
      customerId: userA.id,
      productId: product.id,
      quantity: 1,
    });

    const pending = await PendingPolicy.findOne();

    const res = await request(httpServer)
      .post('/policies/activate')
      .send({
        pendingPolicyId: pending?.id,
        beneficiaryId: userB.id,
      })
      .expect(201);

    expect(res.body).toHaveProperty('beneficiaryId', userB.id);

    // verify pending is soft deleted
    const deleted = await PendingPolicy.findByPk(pending?.id, {
      paranoid: false,
    });
    expect(deleted?.deletedAt).toBeTruthy();

    // verify policy exists
    const policy = await Policy.findOne({
      where: { beneficiaryId: userB.id },
    });

    expect(policy).toBeTruthy();
  });

  it('should not allow same user to have duplicate policies for same product', async () => {
    const { userA, userB, product } = await seedBasicData();

    // buy 2 slots
    await request(httpServer).post('/plans').send({
      customerId: userA.id,
      productId: product.id,
      quantity: 2,
    });

    const pendingPolicies = await PendingPolicy.findAll();

    // activate first
    await request(httpServer)
      .post('/policies/activate')
      .send({
        pendingPolicyId: pendingPolicies[0].id,
        beneficiaryId: userB.id,
      })
      .expect(201);

    // activate second (should fail)
    await request(httpServer)
      .post('/policies/activate')
      .send({
        pendingPolicyId: pendingPolicies[1].id,
        beneficiaryId: userB.id,
      })
      .expect(409); // Conflict
  });

  it('should not allow activating same pending policy twice', async () => {
    const { userA, userB, product } = await seedBasicData();

    await request(httpServer).post('/plans').send({
      customerId: userA.id,
      productId: product.id,
      quantity: 1,
    });

    const pending = await PendingPolicy.findOne();

    await request(app.getHttpServer())
      .post('/policies/activate')
      .send({
        pendingPolicyId: pending?.id,
        beneficiaryId: userB.id,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/policies/activate')
      .send({
        pendingPolicyId: pending?.id,
        beneficiaryId: userB.id,
      })
      .expect(404); // already soft deleted
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
