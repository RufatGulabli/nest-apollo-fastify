import { Module } from '@nestjs/common';
import { DummyJsonModule } from '@libs/services/dummy-json/dummy-json.module';
import { DummyJsonResolver } from '@api/routes/dummy-json/dummy-json.resolver';
import { DummyJsonController } from '@api/routes/dummy-json//dummy-json.controller';

@Module({
  imports: [DummyJsonModule],
  providers: [DummyJsonResolver],
  controllers: [DummyJsonController],
})
export class ApiDummyJsonModule {}
