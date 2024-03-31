import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlarmModule } from './alarm/alarm.module';
import { CoreModule } from './core/core.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options';
import { AlarmInfrastructureModule } from './alarm/infrastructure/alarm-infrastructure.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CoreModule, CqrsModule.forRoot(), SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        AlarmModule.withInfrastructure(
          AlarmInfrastructureModule.use(options.driver),
        ),
      ],
    };
  }
}
