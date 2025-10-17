import {
  Catch,
  Inject,
  HttpStatus,
  ArgumentsHost,
  LoggerService,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ZodError } from 'zod';
import { buildLogObject } from '@libs/common';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly httpAdapter: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType<'graphql'>() === 'graphql') {
      return this.handleGraphQLError(exception, host);
    }

    return this.handleRESTError(exception, host);
  }

  private handleRESTError(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapter;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    this.logger.log(buildLogObject(request, null, exception));

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object') {
        message = (res as any).message ?? message;
        errors = (res as any).errors ?? null;
      } else {
        message = res;
      }
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
    } else if (typeof exception === 'object' && exception !== null) {
      const ex = exception as any;
      if (ex.status) status = ex.status;
      if (ex.message) message = ex.message;
      if (ex.errors) errors = ex.errors;
    }

    const responseBody = {
      statusCode: status,
      message,
      errors,
      error: true,
      data: null,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private handleGraphQLError(exception: unknown, host: ArgumentsHost): void {
    const gqlContext = GqlExecutionContext.create(host as any);
    const request = gqlContext.getContext().req;

    this.logger.log(buildLogObject(request, null, exception));

    let message = 'Internal Server Error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object') {
        message = (res as any).message ?? message;
        errors = (res as any).errors ?? null;
      } else {
        message = res;
      }
      throw new GraphQLError(message, {
        extensions: {
          code: 'BAD_REQUEST',
          errors,
          error: true,
          data: null,
        },
      });
    } else if (exception instanceof ZodError) {
      message = 'Validation failed';
      errors = exception.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      throw new GraphQLError(message, {
        extensions: {
          code: 'VALIDATION_ERROR',
          errors,
          error: true,
          data: null,
        },
      });
    } else if (typeof exception === 'object' && exception !== null) {
      const ex = exception as any;
      if (ex instanceof Error) {
        throw new GraphQLError(ex.message, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error: true,
            data: null,
          },
        });
      }
    }

    throw new GraphQLError(message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        error: true,
        data: null,
      },
    });
  }
}
