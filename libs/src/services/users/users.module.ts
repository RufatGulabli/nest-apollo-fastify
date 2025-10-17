import { Module } from '@nestjs/common';
import { UsersService } from '@libs/services/users/users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
