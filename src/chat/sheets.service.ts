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
    // const credentials = JSON.parse(
    //   this.configService.get<string>('GOOGLE_CREDENTIALS')
    // );
    const credentials = {
      type: 'service_account',
      project_id: this.configService.get('GOODLE_PROJECT_ID'),
      private_key_id: this.configService.get('GOOGLE_PRIVATE_KEY_ID'),
      private_key: this.configService.get('GOOGLE_PRIVATE_KEY'),
      client_email: this.configService.get('GOOGLE_CLIENT_EMAIL'),
      client_id: this.configService.get('GOOGLE_CLIENT_ID'),
      auth_uri: this.configService.get('GOOGLE_AUTH_URI'),
      token_uri: this.configService.get('GOOGLE_TOKEN_URI'),
      auth_provider_x509_cert_url: this.configService.get('GOOGLE_PROVIDER'),
      client_x509_cert_url: this.configService.get('GOOGLE_CLIENT'),
      universe_domain: this.configService.get('GOOGLE_UNIVERSE_DOMAIN'),
    };

    console.log(credentials);

    const auth = new google.auth.GoogleAuth({
      credentials,
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
