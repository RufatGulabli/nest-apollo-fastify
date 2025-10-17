import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { FastifyReply } from 'fastify';
import { Response, Request } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    if (context.getType<'graphql'>() === 'graphql') {
      return this.handleGraphQL(context, next);
    }

    return this.handleREST(context, next);
  }

  private handleREST(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const httpContext = context.switchToHttp();
    const res = httpContext.getResponse<Response | FastifyReply>();
    const req = httpContext.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        const statusCode =
          (res as any).statusCode || (res as any).raw?.statusCode || 200;

        return {
          data: data || null,
          error: false,
          message: data?.message || this.getMessage(statusCode, req),
          statusCode,
        };
      }),
    );
  }

  private handleGraphQL(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(map((data) => data));
  }

  private getMessage(statusCode: number, req: Request) {
    const { method, url } = req;
    const isBulkDeleteRequest = url.includes('/delete/bulk');

    if (statusCode === 200 && method === 'GET') {
      return 'success';
    } else if (statusCode === 201 && method === 'POST') {
      return 'Created successfully';
    } else if (isBulkDeleteRequest) {
      return 'Deleted successfully';
    } else if (statusCode === 200 && method === 'PUT') {
      return 'Updated successfully';
    } else if (statusCode === 200 && method === 'DELETE') {
      return 'Deleted successfully';
    }
    return 'success';
  }

  private getGraphQLMessage(operationType: string) {
    switch (operationType) {
      case 'query':
        return 'success';
      case 'mutation':
        return 'Operation completed successfully';
      case 'subscription':
        return 'Subscription established';
      default:
        return 'success';
    }
  }
}
