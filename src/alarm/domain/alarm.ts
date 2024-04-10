import { AlarmSeverity } from './value-objects/alarm-severity';
import { AlarmItem } from './alarm-item';
import { VersionedAggregateRoot } from '../../shared/domain/aggregate-root';
import { AlarmAcknowledgeEvent } from './events/alarm-acknowledge.event';
import { SerializedEventPayload } from '../../shared/domain/interfaces/serializable-event';
import { AlarmCreatedEvent } from './events/alarm-created.event';

export class Alarm extends VersionedAggregateRoot {
  public name: string;
  public severity: AlarmSeverity;
  public triggeredAt: Date;
  public isAcknowledge = false;
  public items = new Array<AlarmItem>();

  constructor(public id: string) {
    super();
  }

  acknowledge() {
    this.apply(new AlarmAcknowledgeEvent(this.id));
  }

  addAlarmItem(item: AlarmItem) {
    this.items.push(item);
  }

  [`on${AlarmCreatedEvent.name}`](
    event: SerializedEventPayload<AlarmCreatedEvent>,
  ) {
    this.name = event.alarm.name;
    this.severity = new AlarmSeverity(event.alarm.severity);
    this.triggeredAt = new Date(event.alarm.triggeredAt);
    this.isAcknowledge = event.alarm.isAcknowledge;
    this.items = event.alarm.items.map(
      (item) => new AlarmItem(item.id, item.name, item.type),
    );
  }

  [`on${AlarmAcknowledgeEvent.name}`](
    event: SerializedEventPayload<AlarmAcknowledgeEvent>,
  ) {
    if (this.isAcknowledge)
      throw new Error('Alarm has already been acknowledge.');
    this.isAcknowledge = true;
  }
}
