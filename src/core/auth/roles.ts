import z from 'zod';

// type Role = "ADMIN" | "DELIVERY_MAN" <=> z.union([z.literal('ADMIN'), z.literal('DELIVERY_MAN')]);

export const rolesSchema = z.union([z.literal('ADMIN'), z.literal('MEMBER')]);

export type Role = z.infer<typeof rolesSchema>;
