import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, bufferTime, filter, groupBy, map, mergeMap } from 'rxjs';
import { NotifyFacilitySupervisorCommand } from '../commands/notify-facility-supervisor.command';
import { AlarmCreatedEvent } from 'src/alarm/domain/events/alarm-created.event';

@Injectable()
export class CascadingAlarmsSaga {
  private readonly logger = new Logger(CascadingAlarmsSaga.name);

  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AlarmCreatedEvent),
      // TODO: Instead of grouping events by alarm name, we could group them by facility ID
      groupBy((event) => event.alarm.name),
      mergeMap((groupedEvents$) =>
        // Buffer events for 5 seconds or until 3 events are received
        groupedEvents$.pipe(bufferTime(5000, undefined, 3)),
      ),
      filter((events) => events.length >= 3),
      map((events) => {
        this.logger.debug('⚠️⚠️⚠️ 3 alarms in 5 seconds!');
        // TODO: Replace with facility ID
        const facilityId = '12345';
        return new NotifyFacilitySupervisorCommand(
          facilityId,
          events.map((event) => event.alarm.id),
        );
      }),
    );
  };
}
