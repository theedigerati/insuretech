import { Server } from 'http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestDatabaseModule } from './utils/db.module';
import { seedBasicData } from './utils/seed';
import { PendingPolicy, Policy } from '../src/policies/policies.model';
import { UsersModule } from '../src/users/users.module';
import { ProductsModule } from '../src/products/products.module';
import { WalletModule } from '../src/wallet/wallet.module';
import { PlansModule } from '../src/plans/plans.module';
import { PoliciesModule } from '../src/policies/policies.module';
import { Sequelize } from 'sequelize';
import { getConnectionToken } from '@nestjs/sequelize';
import { Plan } from '../src/plans/plans.model';
import { Product } from '../src/products/products.model';

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

  it('should fetch activated policies and filter by plan', async () => {
    const { userA, userB, product, category } = await seedBasicData();

    // purchase plans
    await request(app.getHttpServer()).post('/plans').send({
      customerId: userA.id,
      productId: product.id,
      quantity: 3,
    });
    const newProduct = await Product.create({
      name: 'Optimal Care Standard',
      price: 20_000,
      categoryId: category?.id,
    });
    await request(app.getHttpServer()).post('/plans').send({
      customerId: userA.id,
      productId: newProduct.id,
      quantity: 2,
    });

    // activate pending policies
    const pendings = await PendingPolicy.findAll();
    await request(app.getHttpServer())
      .post('/policies/activate')
      .send({
        pendingPolicyId: pendings[0].id,
        beneficiaryId: userB.id,
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/policies/activate')
      .send({
        pendingPolicyId: pendings[1].id,
        beneficiaryId: userA.id,
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/policies/activate')
      .send({
        pendingPolicyId: pendings[3].id,
        beneficiaryId: userA.id,
      })
      .expect(201);

    // fetch all
    const res = await request(httpServer).get('/policies').expect(200);
    expect(res.body).toHaveLength(3);
    expect(res.body).toHaveProperty([0, 'policyNumber']);
    expect(res.body).toHaveProperty([0, 'product', 'id'], product.id);
    expect(res.body).toHaveProperty([0, 'beneficiary', 'id'], userB.id);

    // filter by plan
    const plan = await Plan.findByPk(pendings[3].planId);
    const _res = await request(httpServer)
      .get(`/policies?plan=${plan?.id}`)
      .expect(200);
    expect(_res.body).toHaveLength(1);
  });
});
