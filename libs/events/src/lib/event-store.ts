import { Injectable } from '@nestjs/common';
import { DomainEvent } from '@ecommerce/shared';

export interface EventStore {
  saveEvents(aggregateId: string, events: DomainEvent[], expectedVersion: number): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
  getAllEvents(fromVersion?: number): Promise<DomainEvent[]>;
}

@Injectable()
export class InMemoryEventStore implements EventStore {
  private events: Map<string, DomainEvent[]> = new Map();
  private allEvents: DomainEvent[] = [];

  async saveEvents(aggregateId: string, events: DomainEvent[], expectedVersion: number): Promise<void> {
    const existingEvents = this.events.get(aggregateId) || [];
    
    if (existingEvents.length !== expectedVersion) {
      throw new Error(`Concurrency conflict. Expected version ${expectedVersion}, but found ${existingEvents.length}`);
    }

    this.events.set(aggregateId, [...existingEvents, ...events]);
    this.allEvents.push(...events);
  }

  async getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]> {
    const events = this.events.get(aggregateId) || [];
    return fromVersion ? events.slice(fromVersion) : events;
  }

  async getAllEvents(fromVersion?: number): Promise<DomainEvent[]> {
    return fromVersion ? this.allEvents.slice(fromVersion) : this.allEvents;
  }
}