import { join } from 'path';

import { WinstonModule } from 'nest-winston';
import { Enhancer, GraphQLModule } from '@nestjs/graphql';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestStartTimeMiddleware } from '@api/middlewares/request-start-time.middleware';
import { ApiDummyJsonModule } from '@api/routes/dummy-json/dummy-json.module';
import { GlobalErrorFilter } from '@api/filters/global.filter';
import { ApiUsersModule } from '@api/routes/users/users.module';
import { AxiosModule } from '@libs/axios/axios.module';
import winston from 'winston';
import {
  GlobalValidationInterceptor,
  ResponseInterceptor,
  LoggingInterceptor,
} from '@api/interceptors';
import {
  ENVIRONMENT_VARIABLES,
  createLoggerOptions,
  validationSchema,
  RootQuery,
  ENV,
} from '@libs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: validationSchema,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(createLoggerOptions),
        }),
      ],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (config: ConfigService<ENVIRONMENT_VARIABLES>) => {
        return {
          debug: config.get(ENV.GRAPHQL_DEBUG) === 'true',
          playground: config.get(ENV.GRAPHQL_PLAYGROUND) === 'true',
          autoSchemaFile: join(process.cwd(), 'src/generated/schema.gql'),
          sortSchema: true,
          fieldResolverEnhancers: ['interceptors'] as Enhancer[],
          autoTransformHttpErrors: true,
          context: (context) => context,
          graphiql: true,
        };
      },
      inject: [ConfigService],
    }),
    AxiosModule,
    ApiUsersModule,
    ApiDummyJsonModule,
  ],
  providers: [
    RootQuery,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalValidationInterceptor,
    },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: GlobalErrorFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStartTimeMiddleware).forRoutes('*');
  }
}
