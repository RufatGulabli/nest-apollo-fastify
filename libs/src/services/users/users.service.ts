import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@api/routes/users/dto/users.rest.dto';
import { CreateUserInput } from '@api/routes/users/dto/users.graphql.dto';
import { UserObject } from '@libs/services/users/user.object';
import { User } from '@libs/services/users/user.entity';
import { v4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  public createUser(user: CreateUserDto | CreateUserInput): UserObject | User {
    const newUser: User = {
      id: v4(),
      phone: user.phone || null,
      age: user.age || null,
      ...user,
    };

    this.users.push(newUser);

    return newUser;
  }

  public getById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  public getAllUsers() {
    return this.users;
  }
}
