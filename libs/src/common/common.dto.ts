import { z } from 'zod';

export const GetByUUIDSchema = z.object({
  id: z.uuidv4(),
});

export const GetByIDSchema = z.object({
  id: z.coerce.number().min(1),
});

export type GetByUUIDDto = z.infer<typeof GetByUUIDSchema>;
export type GetByIDDto = z.infer<typeof GetByIDSchema>;
