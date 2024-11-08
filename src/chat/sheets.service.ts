import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { JiraService } from '../jira/jira.service';

@Injectable()
export class SheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor(
    private readonly jiraService: JiraService,
    private readonly configService: ConfigService
  ) {
    this.spreadsheetId = this.configService.get<string>('GOOGLE_SHEET_ID');

    const auth = new google.auth.GoogleAuth({
      keyFile: './spatial-range-439811-f6-4f755607372c.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async appendRow(values: Record<string, any>) {
    const rows = values.map((item) =>
      Object.values({
        name: item.name || '',
        location: item.location || '',
        issue: item.issue || '',
        imageUrl: item.imageUrl || '',
        email: item.email || '',
        phone: item.phone || '',
      })
    );

    const resource = { values: rows };

    const response = await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      resource,
    });

    await this.jiraService.createTicket(
      `Task relates to: ${values[0].issue}`,
      `${values[0].issue}`,
      values[0].issueType
    );

    return response.data;
  }
}
