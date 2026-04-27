import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findById(id: number) {
    return this.userModel.findByPk(id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
}
