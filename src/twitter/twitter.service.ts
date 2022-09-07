import { Injectable, Logger } from '@nestjs/common';

import Twitter = require('twitter');
import {
  FirebaseAdmin,
  InjectFirebaseAdmin,
} from '@nicholas.braun/nestjs-firebase';
import { CollectionReference } from '@google-cloud/firestore';
import { Tweet } from './tweet.interface';

@Injectable()
export class TwitterService {
  client: Twitter;
  collection: CollectionReference<Tweet>;
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {
    this.client = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: process.env.ACCESS_TOKEN_KEY,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    });
    this.collection = this.firebase.db.collection(
      process.env.TWITTER_DB_COLLECTION.toLowerCase(),
    ) as CollectionReference<Tweet>;
  }

  private readonly logger = new Logger(TwitterService.name);

  async postTweet(message: string, url?: string, trim = true): Promise<string> {
    try {
      const messageCount = message.length + url?.length;
      if (messageCount > 280) {
        if (trim) {
          const toTrim = (messageCount - 276) * -1; //3 is for 3 dots
          message = message.slice(0, toTrim);
          message = message + '...';
        } else {
          return Promise.reject('Message is too long');
        }
      }
      const tweet = await this.client.post('statuses/update', {
        status: message + '\n' + url,
      });
      const firebaseData = await this.storeTweetData(tweet as Tweet);
      return Promise.resolve(firebaseData);
    } catch (e) {
      this.logger.debug(`Error posting tweet ${JSON.stringify(e)}`);
      return Promise.reject(e);
    }
  }

  private async storeTweetData(tweet?: Tweet) {
    try {
      const storing = await this.collection.add(tweet);
      return Promise.resolve(storing.id);
    } catch (e) {
      console.log('e', e);
      return Promise.reject(e);
    }
  }
}
