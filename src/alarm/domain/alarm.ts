import { AlarmSeverity } from './value-objects/alarm-severity';
import { AlarmItem } from './alarm-item';

export class Alarm {
  public name: string;
  public severity: AlarmSeverity;
  public triggeredAt: Date;
  public isAcknowledge = false;
  public items = new Array<AlarmItem>();

  constructor(public id: string) {}

  acknowledge() {
    this.isAcknowledge = true;
  }

  addAlarmItem(item: AlarmItem) {
    this.items.push(item);
  }
}
