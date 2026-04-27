import { Server } from 'http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestDatabaseModule } from './utils/db.module';
import { seedProductsData } from './utils/seed';
import { ProductsModule } from '../src/products/products.module';
import { Sequelize } from 'sequelize';
import { getConnectionToken } from '@nestjs/sequelize';

jest.mock('nanoid', () => ({ nanoid: () => crypto.randomUUID() }));

describe('Products API (e2e)', () => {
  let app: INestApplication<Server>;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, ProductsModule],
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

  it('should fetch products', async () => {
    const { categories_payload, products_payload } = await seedProductsData();

    const res = await request(httpServer).get('/products').expect(200);

    expect(res.body).toHaveLength(4);
    expect(res.body).toHaveProperty([0, 'name'], products_payload[0].name);
    expect(res.body).toHaveProperty([0, 'price'], products_payload[0].price);
    expect(res.body).toHaveProperty(
      [0, 'category', 'name'],
      categories_payload[0].name,
    );
  });
});
