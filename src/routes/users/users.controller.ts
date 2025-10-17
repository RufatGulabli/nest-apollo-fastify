import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '@libs/services/users/users.service';
import {
  ValidateBody,
  ValidateParams,
} from '@api/decorators/validate.decorator';
import { CreateUserSchema } from '@api/routes/users/dto/users.rest.dto';
import type { CreateUserDto } from '@api/routes/users/dto/users.rest.dto';
import { GetByUUIDSchema } from '@libs/common';
import type { GetByUUIDDto } from '@libs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  public getUsers() {
    return this.userService.getAllUsers();
  }

  @ValidateParams(GetByUUIDSchema)
  @Get('/:id')
  public getUser(@Param() { id }: GetByUUIDDto) {
    return this.userService.getById(id);
  }

  @Post()
  @ValidateBody(CreateUserSchema)
  public create(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
}
