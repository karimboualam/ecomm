import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendBulkEmailDto } from './dto/send-bulk-email.dto';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }

  @Post('send-bulk')
  async sendBulkEmail(@Body() sendBulkEmailDto: SendBulkEmailDto) {
    return this.emailService.sendBulkEmail(sendBulkEmailDto);
  }

  @Post('send-template')
  async sendTemplateEmail(@Body() body: {
    templateId: string;
    to: string;
    variables: Record<string, any>;
  }) {
    return this.emailService.sendTemplateEmail(
      body.templateId,
      body.to,
      body.variables
    );
  }

  @Get('logs')
  async getEmailLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('recipient') recipient?: string
  ) {
    return this.emailService.getEmailLogs({
      page,
      limit,
      status,
      recipient,
    });
  }

  @Get('logs/:id')
  async getEmailLog(@Param('id') id: string) {
    return this.emailService.getEmailLog(id);
  }

  @Post('test')
  async sendTestEmail(@Body() body: { to: string; templateId?: string }) {
    return this.emailService.sendTestEmail(body.to, body.templateId);
  }
}