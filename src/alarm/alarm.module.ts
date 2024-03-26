import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';

@Module({
  controllers: [AlarmController],
  providers: [AlarmService],
})
export class AlarmModule {}
