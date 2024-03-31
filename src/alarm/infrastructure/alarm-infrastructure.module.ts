import { Module } from '@nestjs/common';
import { OrmAlarmPersistenceModule } from './persistance/orm/orm-alarm-persistence.module';
import { InMemoryAlarmPersistenceModule } from './persistance/in-memory/in-memory-alarm-persistence.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  exports: [SharedModule],
})
export class AlarmInfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModule =
      driver === 'orm'
        ? OrmAlarmPersistenceModule
        : InMemoryAlarmPersistenceModule;

    return {
      module: AlarmInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
