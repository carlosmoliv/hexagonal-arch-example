import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EVENT_STORE_CONNECTION } from '../../../core/core.constants';
import { Event, EventDocument } from './schemas/event.schema';
import { Model } from 'mongoose';
import { EventBus } from '@nestjs/cqrs';
import { ChangeStreamInsertDocument, ChangeStream } from 'mongodb';
import { EventDeserializer } from './deserializers/event.deserializer';

@Injectable()
export class EventsBridge
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private changeStream: ChangeStream;

  constructor(
    @InjectModel(Event.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<Event>,
    private readonly eventBus: EventBus,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  onApplicationBootstrap() {
    // In the poll-based approach, instead of using a change stream (as we're doing here), we would periodically
    // poll the event store for new events. To keep track of what events we already processed,
    // we would need to store the last processed event (cursor) in a separate collection.

    // TODO: Fix the below type issue
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.changeStream = this.eventStore
      .watch()
      .on('change', (change: ChangeStreamInsertDocument<EventDocument>) => {
        if (change.operationType === 'insert') {
          this.handleEventStoreChange(
            change as ChangeStreamInsertDocument<EventDocument>,
          );
        }
      });
  }

  onApplicationShutdown() {
    return this.changeStream.close();
  }

  handleEventStoreChange(change: ChangeStreamInsertDocument<EventDocument>) {
    // "ChangeStreamInsertedDocument" object exposes the "txnNumber"  property, which represents
    // the transaction identifier. If you need multi-document transactions in your application
    // you can use this property to achieve atomicity
    const insertedEvent = change.fullDocument;
    const eventInstance = this.eventDeserializer.deserialize(insertedEvent);
    this.eventBus.subject$.next(eventInstance.data);
  }
}
