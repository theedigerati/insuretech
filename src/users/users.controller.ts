import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /**
   * Fetch all users
   */
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    const plainUsers = users.map((u) => u.get({ plain: true }));
    return plainToInstance(UserResponseDto, plainUsers, {
      excludeExtraneousValues: true,
    });
  }
}
