import { DomainEvent } from '@/core/events/domain-event';
import { Friendship } from '../models/entities/friendship';

export class AcceptInvitationEvent implements DomainEvent {
	public readonly occurredOn: Date;
	public friendship: Friendship;

	constructor(friendship: Friendship) {
		this.occurredOn = new Date();
		this.friendship = friendship;
	}
}
