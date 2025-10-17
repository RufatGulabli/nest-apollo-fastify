import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AxiosInstanceConfig, AxiosOptions } from '@libs/axios/fixtures';
import { AxiosService } from '@libs/axios/axios.service';
import { ENVIRONMENT_VARIABLES } from '@libs/common';

@Module({})
export class AxiosModule {
  static register(
    options: AxiosInstanceConfig[],
    instanceName: string,
  ): DynamicModule {
    const axiosConfigProvider: Provider = {
      provide: `${instanceName}_AXIOS_CONFIG`,
      useFactory: (configService: ConfigService<ENVIRONMENT_VARIABLES>) => {
        const optionsObj: AxiosOptions = { baseUrl: '', headers: {} };
        for (const pair of options) {
          const envVariable = configService.get(
            (pair.value || pair.ENV_NAME) as keyof ENVIRONMENT_VARIABLES,
          );
          if (pair.isHeader) optionsObj.headers[pair.ENV_NAME] = envVariable;
          else optionsObj[pair.ENV_NAME] = envVariable;
        }
        return optionsObj;
      },
      inject: [ConfigService],
    };

    const axiosServiceProvider: Provider = {
      provide: `${instanceName}_AXIOS_SERVICE`,
      useFactory: (config: AxiosOptions) => new AxiosService(config),
      inject: [`${instanceName}_AXIOS_CONFIG`],
    };

    return {
      module: AxiosModule,
      imports: [ConfigModule],
      providers: [axiosConfigProvider, axiosServiceProvider],
      exports: [axiosServiceProvider],
    };
  }
}
