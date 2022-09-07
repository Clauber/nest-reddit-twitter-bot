import { Module } from '@nestjs/common';
import { RedditService } from './reddit.service';
import { RedditController } from './reddit.controller';
import { FirebaseModule } from '@nicholas.braun/nestjs-firebase';

@Module({
  imports: [],
  controllers: [RedditController],
  providers: [RedditService],
})
export class RedditModule {}
