import { AlarmSeverity } from './value-objects/alarm-severity';
import { AlarmItem } from './alarm-item';
import { VersionedAggregateRoot } from '../../shared/domain/aggregate-root';
import { AlarmAcknowledgedEvent } from './events/alarm-acknowledged.event';
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
    this.apply(new AlarmAcknowledgedEvent(this.id));
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

  [`on${AlarmAcknowledgedEvent.name}`](
    event: SerializedEventPayload<AlarmAcknowledgedEvent>,
  ) {
    if (this.isAcknowledge)
      throw new Error('Alarm has already been acknowledge.');
    this.isAcknowledge = true;
  }
}
