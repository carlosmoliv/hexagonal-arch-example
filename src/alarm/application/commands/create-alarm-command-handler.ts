import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CreateAlarmCommand } from './create-alarm.command';
import { AlarmRepository } from '../ports/alarm.repository';
import { AlarmFactory } from '../../domain/factories/alarm.factory';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly alarmRepository: AlarmRepository,
    private readonly alarmFactory: AlarmFactory,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(
      `Processing "CreateAlarmCommand": ${JSON.stringify(command)}`,
    );
    const alarm = this.alarmFactory.create(command.name, command.severity);
    return this.alarmRepository.save(alarm);
  }
}
