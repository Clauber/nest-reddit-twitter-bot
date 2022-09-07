import { Module } from '@nestjs/common';
import { RedditTwitterService } from './reddit-twitter.service';
import { RedditTwitterController } from './reddit-twitter.controller';
import { RedditService } from '../reddit/reddit.service';
import { TwitterService } from '../twitter/twitter.service';

@Module({
  controllers: [RedditTwitterController],
  providers: [RedditTwitterService, RedditService, TwitterService],
})
export class RedditTwitterModule {}
