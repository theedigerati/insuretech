import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductCategorySeeder } from '../seeders/product-category.seeder';
import { ProductSeeder } from '../seeders/product.seeder';
import { UserSeeder } from '../seeders/users.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // suppress NestJS boot logs
  });

  console.log('🌱 Seeding database...\n');

  await app.get(ProductCategorySeeder).run();
  await app.get(ProductSeeder).run();
  await app.get(UserSeeder).run();

  console.log('\n🎉 Seeding complete');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
