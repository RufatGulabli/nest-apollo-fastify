import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}

@Injectable()
export class RequestStartTimeMiddleware implements NestMiddleware {
  use(req: FastifyRequest, _: FastifyReply, next: () => void) {
    req.startTime = Date.now();
    next();
  }
}
