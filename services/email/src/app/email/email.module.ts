import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EmailLog } from './entities/email-log.entity';
import { EmailProvider } from './providers/email.provider';
import { PostmarkProvider } from './providers/postmark.provider';
import { ResendProvider } from './providers/resend.provider';
import { SendgridProvider } from './providers/sendgrid.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLog]),
    BullModule.registerQueue({
      name: 'email-queue',
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    }),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    EmailProcessor,
    EmailProvider,
    PostmarkProvider,
    ResendProvider,
    SendgridProvider,
  ],
  exports: [EmailService],
})
export class EmailModule {}