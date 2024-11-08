import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Post('add-row')
  async addRow(@Body() data: Record<string, any>) {
    await this.sheetsService.appendRow([data]);
    return {
      status: HttpStatus.OK,
      message: 'Done successfully',
    };
  }
}
