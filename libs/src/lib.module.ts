import { Module } from '@nestjs/common';
import { AxiosModule } from './axios/axios.module';
import { UsersModule } from '@libs/services/users/users.module';
import { DummyJsonModule } from '@libs/services/dummy-json/dummy-json.module';

@Module({
  imports: [UsersModule, AxiosModule, DummyJsonModule],
})
export class LibModule {}
