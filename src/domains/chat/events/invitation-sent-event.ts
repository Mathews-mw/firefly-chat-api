import { DomainEvent } from '@/core/events/domain-event';
import { Invitation } from '../models/entities/invitation';

export class InvitationSentEvent implements DomainEvent {
	public readonly occurredOn: Date;
	public invitation: Invitation;

	constructor(invitation: Invitation) {
		this.occurredOn = new Date();
		this.invitation = invitation;
	}
}
