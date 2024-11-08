import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IAuth } from '../@types/auth.interface';
import { EIssueType } from '../@types/jira.enum';

@Injectable()
export class JiraService {
  private jiraUrl = 'https://complaintandissues.atlassian.net/rest/api/2/issue';
  private readonly auth: IAuth;
  private readonly key: string;

  constructor(private readonly configService: ConfigService) {
    this.auth = {
      username: this.configService.get<string>('EMAIL'),
      password: this.configService.get<string>('JIRA_API_TOKEN'),
    };
    this.key = this.configService.get<string>('KEY');
  }

  async createTicket(
    summary: string,
    description: string,
    issueType: EIssueType
  ) {
    const data = {
      fields: {
        project: {
          key: this.key,
        },
        summary,
        description,
        issuetype: {
          name: issueType,
        },
      },
    };

    try {
      const response = await axios.post(this.jiraUrl, data, {
        auth: this.auth,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Jira ticket:', error);
      throw new Error('Could not create Jira ticket');
    }
  }
}
