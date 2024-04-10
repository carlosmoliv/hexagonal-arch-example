import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedAlarmRepository } from '../ports/upsert-materialized-alarm.repository';
import { SerializedEventPayload } from '../../../shared/domain/interfaces/serializable-event';
import { AlarmAcknowledgeEvent } from '../../domain/events/alarm-acknowledge.event';

@EventsHandler(AlarmAcknowledgeEvent)
export class AlarmAcknowledgeEventHandler
  implements IEventHandler<SerializedEventPayload<AlarmAcknowledgeEvent>>
{
  private readonly logger = new Logger(AlarmAcknowledgeEventHandler.name);

  constructor(
    private readonly upsertMaterializedRepository: UpsertMaterializedAlarmRepository,
  ) {}

  async handle(event: SerializedEventPayload<AlarmAcknowledgeEvent>) {
    this.logger.log(`Alarm acknowledge event: ${JSON.stringify(event)}`);
    await this.upsertMaterializedRepository.upsert({
      id: event.alarmId,
      isAcknowledge: true,
    });
  }
}
