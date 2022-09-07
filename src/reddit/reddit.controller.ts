import { Controller, Get } from '@nestjs/common';

import { RedditService } from './reddit.service';

@Controller('reddit')
export class RedditController {
  constructor(private readonly redditService: RedditService) {}

  @Get()
  async test() {
    return await this.redditService.checkRedditForUpdates();
  }
}
