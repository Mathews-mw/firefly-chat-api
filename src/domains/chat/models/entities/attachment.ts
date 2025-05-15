import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { z } from 'zod';

export const attachmentTypeSchema = z.union([
	z.literal('IMAGE'),
	z.literal('VIDEO'),
	z.literal('DOCUMENT'),
	z.literal('FILE'),
	z.literal('AUDIO'),
]);

export type AttachmentType = z.infer<typeof attachmentTypeSchema>;

export interface IAttachmentProps {
	title: string;
	url: string;
	messageId?: UniqueEntityId | null;
	roomId?: UniqueEntityId | null;
	type: AttachmentType;
}

export class Attachment extends Entity<IAttachmentProps> {
	get title() {
		return this.props.title;
	}

	set title(title: string) {
		this.props.title = title;
	}

	get url() {
		return this.props.url;
	}

	set url(url: string) {
		this.props.url = url;
	}

	get messageId() {
		return this.props.messageId;
	}

	set messageId(messageId: UniqueEntityId | undefined | null) {
		this.props.messageId = messageId;
	}

	get roomId() {
		return this.props.roomId;
	}

	set roomId(roomId: UniqueEntityId | undefined | null) {
		this.props.roomId = roomId;
	}

	get type() {
		return this.props.type;
	}

	set type(type: AttachmentType) {
		this.props.type = type;
	}

	static create(props: IAttachmentProps, id?: UniqueEntityId) {
		const attachment = new Attachment(props, id);

		return attachment;
	}
}
