import { Controller, Get } from '@nestjs/common';
import { RedditTwitterService } from './reddit-twitter.service';

@Controller('reddit-twitter')
export class RedditTwitterController {
  constructor(private readonly redditTwitterService: RedditTwitterService) {}

  @Get()
  async testing() {
    return this.redditTwitterService.getRedditUpdates();
  }
}
