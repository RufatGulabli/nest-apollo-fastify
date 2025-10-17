import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ZOD_BODY_SCHEMA_KEY,
  ZOD_INPUT_SCHEMA_KEY,
  ZOD_PARAMS_SCHEMA_KEY,
} from '@api/decorators/validate.decorator';

@Injectable()
export class GlobalValidationInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (context.getType<'graphql'>() === 'graphql') {
      return this.validateGraphQL(context, next);
    }

    return this.validateREST(context, next);
  }

  private async validateGraphQL(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const gqlContext = GqlExecutionContext.create(context);
    const args = gqlContext.getArgs();

    const inputSchema = this.reflector.get(
      ZOD_INPUT_SCHEMA_KEY,
      context.getHandler(),
    );

    if (inputSchema && args.input) {
      try {
        const validated = await inputSchema.parseAsync(args.input);
        args.input = validated;
      } catch (error) {
        this.throwValidationError(error);
      }
    }

    return next.handle();
  }

  private async validateREST(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const bodySchema = this.reflector.get(
      ZOD_BODY_SCHEMA_KEY,
      context.getHandler(),
    );

    if (bodySchema) {
      try {
        const validated = await bodySchema.parseAsync(request.body);
        request.body = validated;
      } catch (error) {
        this.throwValidationError(error);
      }
    }

    const paramsSchema = this.reflector.get(
      ZOD_PARAMS_SCHEMA_KEY,
      context.getHandler(),
    );

    if (paramsSchema) {
      try {
        const validated = await paramsSchema.parseAsync(request.params);
        request.params = validated;
      } catch (error) {
        this.throwValidationError(error);
      }
    }

    return next.handle();
  }

  private throwValidationError(error: any) {
    if (error instanceof ZodError) {
      throw new ZodError(error.issues);
    }

    throw new BadRequestException({
      message: 'Unexpected validation error',
      details: error?.message ?? 'Unknown error',
    });
  }
}
