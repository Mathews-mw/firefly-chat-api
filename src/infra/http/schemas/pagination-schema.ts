import z from 'zod';

export const paginationResponseSchema = z.object({
	page: z.coerce.number(),
	per_page: z.coerce.number(),
	total_occurrences: z.coerce.number(),
	total_pages: z.coerce.number(),
});

export type PaginationSchemaResponse = z.infer<typeof paginationResponseSchema>;
