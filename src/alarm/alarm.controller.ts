import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { UpdateAlarmDto } from './dto/update-alarm.dto';

@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Post()
  create(@Body() createAlarmDto: CreateAlarmDto) {
    return this.alarmService.create(createAlarmDto);
  }

  @Get()
  findAll() {
    return this.alarmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alarmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlarmDto: UpdateAlarmDto) {
    return this.alarmService.update(+id, updateAlarmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alarmService.remove(+id);
  }
}
