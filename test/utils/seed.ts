import { Product, ProductCategory } from '../../src/products/products.model';
import { User } from '../../src/users/users.model';

export async function seedBasicData() {
  const userA = await User.create({
    name: 'Tony',
    email: 'tony@test.com',
    walletBalance: 100_000,
  });

  const userB = await User.create({
    name: 'Sharon',
    email: 'sharon@test.com',
    walletBalance: 0,
  });

  const category = await ProductCategory.create({
    name: 'Health',
  });

  const product = await Product.create({
    name: 'Optimal Care Mini',
    price: 10_000,
    categoryId: category.id,
  });

  return { userA, userB, product, category };
}

export async function seedProductsData(): Promise<{
  categories_payload: { name: string }[];
  products_payload: { name: string; price: number; categoryId: number }[];
}> {
  const categories = ['Health', 'Third-party_Auto', 'Comprehensive_Auto'];
  const categories_payload = categories.map((c) => ({ name: c }));
  const categories_obj = await ProductCategory.bulkCreate(categories_payload);
  const products_payload = [
    {
      name: 'Optimal Care Mini',
      price: 10_000,
      categoryId: categories_obj[0].id,
    },
    {
      name: 'Optimal care standard',
      price: 20_000,
      categoryId: categories_obj[0].id,
    },
    {
      name: '3rd party Car Plan XYZ',
      price: 5_000,
      categoryId: categories_obj[1].id,
    },
    {
      name: 'Comprehensive Car Plan XYZ',
      price: 15_000,
      categoryId: categories_obj[2].id,
    },
  ];
  await Product.bulkCreate(products_payload);
  return { categories_payload, products_payload };
}
