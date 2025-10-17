import { format } from 'winston';
import { FastifyRequest } from 'fastify';

export function buildLogObject(
  request: FastifyRequest,
  data: any,
  exception?: any,
) {
  const duration = Date.now() - request.raw['startTime'];

  return {
    ...(exception && { level: 'error' }),
    duration: `${duration}ms`,
    'x-client-key': request.raw.headers['x-client-key'],
    'x-real-ip': request.raw.headers['x-real-ip'],
    ...(exception && { stack_trace: exception.stack }),
    message: exception
      ? `${exception.message} <REQUEST>: ${JSON.stringify(request.body)} <RESPONSE>: ${JSON.stringify(data)}`
      : `<REQUEST>: ${JSON.stringify(request.body)} <RESPONSE>: ${JSON.stringify(data)}`,
  };
}

export const createLoggerOptions = format.printf((info: any) => {
  return JSON.stringify({
    ...info,
    '@timestamp': new Date().toISOString(),
    level: info?.level?.toUpperCase(),
  });
});
