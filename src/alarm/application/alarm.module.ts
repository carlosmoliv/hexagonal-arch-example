import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from '../presenters/http/alarm.controller';
import { AlarmFactory } from '../domain/factories/alarm.factory';

@Module({
  controllers: [AlarmController],
  providers: [AlarmService, AlarmFactory],
})
export class AlarmModule {}
