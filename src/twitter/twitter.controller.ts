import { Controller, Post, Body } from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post()
  async create(@Body() body: { message: string }) {
    return await this.twitterService.postTweet(body.message);
  }
}
