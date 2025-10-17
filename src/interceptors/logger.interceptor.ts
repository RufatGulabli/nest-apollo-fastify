import {
  Inject,
  Injectable,
  CallHandler,
  LoggerService,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { buildLogObject } from '@libs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<'graphql'>() === 'graphql') {
      return this.logGraphQL(context, next);
    }

    return this.logREST(context, next);
  }

  private logREST(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (
      (request.url === '/v1' && request.method === 'GET') ||
      request.url.includes('logs') ||
      request.url.includes('health')
    ) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(tap((data) => this.logger.log(buildLogObject(request, data))));
  }

  private logGraphQL(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    return next
      .handle()
      .pipe(tap((data) => this.logger.log(buildLogObject(request, data))));
  }
}
