import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserSchema } from '@api/routes/users/dto/users.rest.dto';
import { UsersService } from '@libs/services/users/users.service';
import { UserObject } from '@libs/services/users/user.object';
import { GetByUUIDSchema } from '@libs/common';
import {
  CreateUserInput,
  GetByUUIDInput,
} from '@api/routes/users/dto/users.graphql.dto';
import {
  ValidateInput,
  ValidateParams,
} from '@api/decorators/validate.decorator';

@Resolver(() => UserObject)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => [UserObject])
  public getUsers() {
    return this.userService.getAllUsers();
  }

  @ValidateParams(GetByUUIDSchema)
  @Query(() => UserObject, { nullable: true })
  public getUser(@Args('input') input: GetByUUIDInput) {
    return this.userService.getById(input.id);
  }

  @ValidateInput(CreateUserSchema)
  @Mutation(() => UserObject)
  public create(@Args('input') input: CreateUserInput): UserObject {
    return this.userService.createUser(input) as UserObject;
  }
}
