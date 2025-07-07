import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ContentSubmissionModule } from './content-submission/content-submission.module';
import { ContentSubmission } from './content-submission/entities/content-submission.entity';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AiProcessingService } from './ai-processing/ai-processing.service';
import { AiProcessingModule } from './ai-processing/ai-processing.module';
import { QueueModule } from './queue/queue.module';
import { BullModule } from '@nestjs/bull';
import { NottificationsModule } from './notifications/nottifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [User, ContentSubmission],
      }),
    }),

    UserModule,
    ContentSubmissionModule,
    AuthModule,
    AiProcessingModule,
    QueueModule,
    NottificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AiProcessingService],
})
export class AppModule {}
