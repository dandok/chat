import { Module } from '@nestjs/common';
import { SheetsController } from './sheets.controller';
import { SheetsService } from './sheets.service';
import { JiraService } from 'src/jira/jira.service';

@Module({
  controllers: [SheetsController],
  providers: [SheetsService, JiraService]
})
export class SheetsModule {}
