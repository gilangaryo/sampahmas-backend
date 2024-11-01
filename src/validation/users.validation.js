// user-validation.js
import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters long'),

});

export default CreateUserSchema;