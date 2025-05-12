import { FastifyInstance } from 'fastify';

import { authMiddleware } from '../middlewares/auth-middleware';
import { uploadChatAttachmentsController } from '../controllers/attachments/upload-chat-attachments-controller';

export async function attachmentsRoutes(app: FastifyInstance) {
	app.post('/chat', { preHandler: [authMiddleware], schema: { hide: true } }, uploadChatAttachmentsController);
}
