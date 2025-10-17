import { SetMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

export const ZOD_BODY_SCHEMA_KEY = 'zod_body_schema';
export const ZOD_PARAMS_SCHEMA_KEY = 'zod_params_schema';
export const ZOD_INPUT_SCHEMA_KEY = 'zod_input_schema';

export const ValidateBody = (schema: ZodSchema) =>
  SetMetadata(ZOD_BODY_SCHEMA_KEY, schema);

export const ValidateParams = (schema: ZodSchema) =>
  SetMetadata(ZOD_PARAMS_SCHEMA_KEY, schema);

export const ValidateInput = (schema: ZodSchema) =>
  SetMetadata(ZOD_INPUT_SCHEMA_KEY, schema);
