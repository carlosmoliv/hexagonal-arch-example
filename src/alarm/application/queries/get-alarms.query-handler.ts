import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAlarmsQuery } from './get-alarms.query';
import { Alarm } from '../../domain/alarm';
import { AlarmRepository } from '../ports/alarm.repository';

@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler
  implements IQueryHandler<GetAlarmsQuery, Alarm[]>
{
  constructor(private readonly alarmRepository: AlarmRepository) {}

  execute(query: GetAlarmsQuery): Promise<Alarm[]> {
    return this.alarmRepository.findAll();
  }
}
