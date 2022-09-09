import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TwitterService } from '../twitter/twitter.service';
import { RedditService } from '../reddit/reddit.service';
import {
  FirebaseAdmin,
  InjectFirebaseAdmin,
} from '@nicholas.braun/nestjs-firebase';
import { CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class RedditTwitterService {
  collection: CollectionReference;
  constructor(
    private readonly redditService: RedditService,
    private readonly twitterService: TwitterService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {
    this.collection = this.firebase.db.collection(
      process.env.TWITTER_REDDIT_DB_COLLECTION.toLowerCase(),
    ) as CollectionReference;
  }
  private readonly logger = new Logger(RedditTwitterService.name);

  @Cron('0 * * * * *')
  async handleCron() {
    this.logger.debug('Running the chron!');
    //Get reddit update
    await this.getRedditUpdates();

    //
  }
  async getRedditUpdates() {
    const newItems = await this.redditService.checkRedditForUpdates();
    this.logger.log(`New items! ${newItems.length}`);
    if (newItems.length > 0) {
      //Post items on twitter
      for (const post of newItems) {
        const message = post.title;
        const url = 'https://www.reddit.com' + post.permalink;
        const tweetId = await this.twitterService.postTweet(message, url, true);
        const storeItem = {
          tweetId,
          redditId: post.id,
        };
        this.storeRedditTwitterRelation(storeItem);
      }
    }
  }

  async storeRedditTwitterRelation(item: {
    tweetId: string;
    redditId: string;
  }) {
    try {
      return await this.collection.add(item);
    } catch (e) {
      console.log('Issues saving relation', e);
    }
  }
}
