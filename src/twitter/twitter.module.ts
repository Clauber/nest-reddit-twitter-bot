import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { FirebaseModule } from '@nicholas.braun/nestjs-firebase';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: './firebase.json',
    }),
  ],
  controllers: [TwitterController],
  providers: [TwitterService],
})
export class TwitterModule {}
