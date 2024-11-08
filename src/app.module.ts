import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SheetsModule } from './chat/sheets.module';
import { SheetsService } from './chat/sheets.service';
import { JiraService } from './jira/jira.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SheetsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SheetsService, JiraService],
})
export class AppModule {}
