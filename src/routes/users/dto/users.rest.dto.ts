import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  age: z.number().min(18, 'Must be 18 or older').optional(),
});

export type CreateUserDto = z.input<typeof CreateUserSchema>;
