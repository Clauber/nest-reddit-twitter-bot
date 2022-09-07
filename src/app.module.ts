import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterModule } from './twitter/twitter.module';
import { RedditModule } from './reddit/reddit.module';
import { FirebaseModule } from '@nicholas.braun/nestjs-firebase';
import { RedditTwitterModule } from './reddit-twitter/reddit-twitter.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: './firebase.json',
    }),
    TwitterModule,
    ConfigModule.forRoot(),
    RedditModule,
    RedditTwitterModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
