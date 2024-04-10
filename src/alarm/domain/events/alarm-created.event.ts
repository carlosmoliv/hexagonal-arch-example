import { Alarm } from '../alarm';
import { AutowiredEvent } from '../../../shared/decorators/autowired-event.decorator';

@AutowiredEvent
export class AlarmCreatedEvent {
  constructor(public readonly alarm: Alarm) {}
}
