import { CollectionReference } from '@google-cloud/firestore';
import { Injectable } from '@nestjs/common';
import {
  FirebaseAdmin,
  InjectFirebaseAdmin,
} from '@nicholas.braun/nestjs-firebase';
import axios from 'axios';

const API_ENDPOINT_PATTERN = 'https://www.reddit.com/r/$1/new.json';

@Injectable()
export class RedditService {
  collection: CollectionReference;
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {
    this.collection = this.firebase.db.collection(
      process.env.REDDIT_DB_COLLECTION.toLowerCase(),
    ) as CollectionReference;
  }

  async checkRedditForUpdates() {
    const redditData = await axios.get(
      process.env.SUBREDDIT.replace(/(.*)/, API_ENDPOINT_PATTERN),
    );
    const redditItems = await this.processRedditJson(redditData.data);

    return Promise.resolve(redditItems);
  }

  private async hasBeenStored(postId) {
    try {
      const item = await this.collection.where('data.id', '==', postId).get();
      if (item.docs[0]) {
        return true;
      }
      return false;
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }
  private async processRedditJson(json, storeItems = false) {
    const newPosts = [];
    try {
      const items = json.data.children.reverse();
      for (const post of items) {
        if (!storeItems) {
          const hasBeenStored = await this.hasBeenStored(post.data.id);
          if (!hasBeenStored) {
            newPosts.push(post.data);
            const newFirebaseItem = await this.collection.add(post);
            post['firebaseId'] = newFirebaseItem.id;
          }
        }
      }
      return Promise.resolve(newPosts);
    } catch (e) {
      console.log('ANOTHER ERROR', e);
    }
  }
}
