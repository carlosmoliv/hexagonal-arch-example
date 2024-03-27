import { Module } from '@nestjs/common';
import { OrmAlarmPersistenceModule } from './persistance/orm/orm-alarm-persistence.module';
import { InMemoryAlarmPersistenceModule } from './persistance/in-memory/in-memory-alarm-persistence.module';

@Module({})
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
