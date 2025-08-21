import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '@ecommerce/shared';

export interface IEventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}

export function EventHandler(eventType: string) {
  return function (target: any) {
    OnEvent(eventType)(target.prototype, 'handle', Object.getOwnPropertyDescriptor(target.prototype, 'handle'));
    return target;
  };
}