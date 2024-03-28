import { Injectable } from '@nestjs/common';
import { CreateAlarmCommand } from './commands/create-alarm.command';
import { AlarmRepository } from './ports/alarm.repository';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class AlarmService {
  constructor(
    private readonly alarmRepository: AlarmRepository,
    private readonly commandBus: CommandBus,
  ) {}

  create(createAlarmCommand: CreateAlarmCommand) {
    return this.commandBus.execute(createAlarmCommand);
  }

  findAll() {
    return this.alarmRepository.findAll();
  }
}
