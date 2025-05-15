import { AttachmentType } from '@/domains/chat/models/entities/attachment';

// Definição das categorias possíveis
export enum FileCategory {
	IMAGE = 'IMAGE',
	VIDEO = 'VIDEO',
	DOCUMENT = 'DOCUMENT',
	AUDIO = 'AUDIO',
	FILE = 'FILE', // fallback para outros tipos
}

export function categorizeMimeType(mimeType: string): AttachmentType {
	// Imagens
	if (mimeType.startsWith('image/')) {
		return FileCategory.IMAGE;
	}

	// Vídeos
	if (mimeType.startsWith('video/')) {
		return FileCategory.VIDEO;
	}

	// Áudio
	if (mimeType.startsWith('audio/')) {
		return FileCategory.AUDIO;
	}

	// Documentos (PDF, Word, planilhas, apresentações, textos, etc.)
	const documentMimeTypes = new Set<string>([
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-powerpoint',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'application/rtf',
	]);

	if (documentMimeTypes.has(mimeType) || mimeType.startsWith('text/')) {
		return FileCategory.DOCUMENT;
	}

	// Qualquer outro tipo vai para FILE
	return FileCategory.FILE;
}
