import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async run(): Promise<void> {
    const users = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        walletBalance: 50_000,
      },
      { name: 'Bob Smith', email: 'bob@example.com', walletBalance: 50_000 },
      {
        name: 'Carol White',
        email: 'carol@example.com',
        walletBalance: 50_000,
      },
    ];

    for (const user of users) {
      await this.userModel.findOrCreate({
        where: { email: user.email },
        defaults: user,
      });
    }

    console.log('✅ Users seeded');
  }
}
