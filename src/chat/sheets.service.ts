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
      project_id: 'spatial-range-439811-f6',
      private_key_id: '4f755607372cdddd9cc357c5905a359859bf3f60',
      private_key:
        '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnuh5JHhhD28sH\\nrS55oUX9c/3oPxBt1c1R4wSCXBBe/gT30L9JivtcyONMwrFI1TmwOnFdSeTXPvsK\\nn+LH/luVxZMAYl/q7n06yR8LzXghynN2E41w3x0yAWynuMkLLrpzJhYX4nIa7+Lf\\nu/twvkh2nhLiozYRzOaPwOVxpPQ8oyrRu29QbqjCQEAY+H2grAg7HTKB0Siy//tX\\nAwoSJb/nVkITWMFzL0WFE+77GtVGQ9gc03syibLWsButjp38HegdMOEcAC2cQl4k\\nEPM3NLyamXdoicDwQ87l89MJZgdxfkGYshO1/E6yR08WPI/bnCo/m7Pq2sKCpGRr\\nl7MX18VlAgMBAAECggEARRgNQNambVHeVfe4FP/kOrAtMR7FkFGKhsirw13UmqUu\\n+71hB5U6zjKtPCJZ8ORxotC4gZMes7LsrKhHvlZgeRbOY1KjK776FJzkbrLCYb0q\\nCkKsugoXV1Gx5nffTf1+blAKuuUcV09p2Pvx7TRd2otswTM142hStHZkroei21U6\\nosuiT2JNqE/2eGPVUVL3Pr5T8NXNZTF5O9LuZVsLYJg5WqhYirRqD2k6qa1QoNwz\\nXUUNi6CtldvwZCuyM79usHttf8SHCeqXq1PrWMBtP5XAwWAvKMVkjpwzPa/m/kna\\n8Bl11DCEpVr/hUgB3XG8G6A1VoKcSOXp8Kamx+yi8wKBgQDjuOKmtMn7a+mqpBEP\\nmIKiDapPJkkLc4eEcsJ1BERAO0qFLGik1N3cg8e0qEblEBX09qPQ5Y1U91UKJHED\\nPpNVQk6NfpepTHHV47nDLWhWInYw3p2ZxqWLnOnTQeEsqAAdcwunaDOu11im3UEZ\\ntb6r4UcmpT+7bLbX6XtlH+ICUwKBgQC8jggwjuSmQfDGFp0Ba2Cwq0Fa8pB9XuMJ\\nj9pcPiCupXbRY83zH4Zp/2TQnEAASsRexpTCKBjpS8bckOxs5zhAzhKC66bWNOqn\\nwxBEdi8XuRF4HH8iSza2XPpfpaf2G9MjkHhHIHgMtYq86RL8YXJY4tMEtuCpz/Xg\\nO2xnF2USZwKBgF5U3C7KfVEVJrp1NEwNlS+kEYSwC1ofBWgsUbk/hzZEWV5JQx/k\\nvfL28+c2PgftXesXsEx8istDmYqWBeqeJVIQIZIjepe6/vznVLAxQyNLK0KbNRXa\\nYAExgvrsM2bYQRPx8EXsuFwZALQ+uxT3YIC61UqA8aGmKyfNpDwDtQ/ZAoGBALKs\\nDEqnPTfmiFfNGd48eBUxUu7xp8WFYrKu5AZAwQt9s8fbQU8+8koDPu8HAQbF0qrU\\nliYdhO2dZsWfdsoDmKSgIZ5521BkOG/cQc/+BcX/EvS0XCyNBT1tgbuc6DooR70N\\nq0wLEndImD1GxzzswkREPB3dhaqka6Od660M2DPFAoGAdRDJWqD5gstDIsoKPcjq\\nbulGZH8xsbtwLhzMDZlfuMoLREno+xUsSfNEu2GUcNA+KW9kUhasahGy9Bgs1pqP\\ni6IiTajFqw8J1ubPco29vLpLncYH1iUR3X2J8k/dL+IPTQutYujXSCiYwNHLNi6O\\n09itS6DWAAavU8hh5D1Y7X0=\\n-----END PRIVATE KEY-----\\n',
      client_email:
        'googlesheetserviceaccount@spatial-range-439811-f6.iam.gserviceaccount.com',
      client_id: '101467606236589351881',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/googlesheetserviceaccount%40spatial-range-439811-f6.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
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
