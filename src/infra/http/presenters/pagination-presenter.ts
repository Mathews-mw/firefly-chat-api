import { IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { PaginationSchemaResponse } from '../schemas/pagination-schema';

export class PaginationPresenter {
	static toHTTP(pagination: IPaginationResponse): PaginationSchemaResponse {
		return {
			page: pagination.page,
			per_page: pagination.perPage,
			total_occurrences: pagination.totalOccurrences,
			total_pages: pagination.totalPages,
		};
	}
}
