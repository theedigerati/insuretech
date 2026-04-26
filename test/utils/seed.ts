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

  return { userA, userB, product };
}
