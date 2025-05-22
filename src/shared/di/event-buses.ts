import { container } from 'tsyringe';

import { EventBus } from '@/core/events/event-bus';
import { InvitationSentEvent } from '@/domains/chat/events/invitation-sent-event';
import { AcceptInvitationEvent } from '@/domains/chat/events/accept-invitation-event';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { NotificationCreateEvent } from '@/domains/notification/events/notification-create-event';
import { NotifyOnInvitationSent } from '@/domains/notification/handlers/notify-on-invitation-sent';
import { NotifyOnAcceptInvitation } from '@/domains/notification/handlers/notify-on-accept-invitation';
import { WebsocketNotificationHandler } from '@/domains/notification/handlers/websocket-notification-handler';

const eventBus = container.resolve<EventBus>(DEPENDENCY_IDENTIFIERS.EVENT_BUS);

const notifyOnInvitationSent = container.resolve(NotifyOnInvitationSent);
const notifyOnAcceptInvitation = container.resolve(NotifyOnAcceptInvitation);
const wsNotificationHandler = container.resolve(WebsocketNotificationHandler);

eventBus.register(InvitationSentEvent, notifyOnInvitationSent);
eventBus.register(AcceptInvitationEvent, notifyOnAcceptInvitation);
eventBus.register(NotificationCreateEvent, wsNotificationHandler);
