import { Module } from '@nestjs/common';
import { UsersModule } from '@libs/services/users/users.module';
import { UsersController } from '@api/routes/users/users.controller';
import { UserResolver } from '@api/routes/users/user.resolver';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [UserResolver],
})
export class ApiUsersModule {}
