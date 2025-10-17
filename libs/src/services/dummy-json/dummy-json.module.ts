import { Module } from '@nestjs/common';
import { DummyJsonService } from '@libs/services/dummy-json/dummy-json.service';
import { AxiosModule } from '@libs/axios/axios.module';
import { ENV, EXTERNAL_SERVICES } from '@libs/common';

@Module({
  imports: [
    AxiosModule.register(
      [{ ENV_NAME: 'baseUrl', value: ENV.DUMMY_JSON_BASE_URL }],
      EXTERNAL_SERVICES.DUMMY_JSON,
    ),
  ],
  providers: [
    DummyJsonService,
    {
      provide: EXTERNAL_SERVICES.DUMMY_JSON,
      useExisting: 'DUMMY_JSON_AXIOS_SERVICE',
    },
  ],
  exports: [DummyJsonService],
})
export class DummyJsonModule {}
