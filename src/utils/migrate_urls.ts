import mongoose from 'mongoose';
import { Ad } from '../models/Ad';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/androidtv_db';

async function migrate() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const ads = await Ad.find({}).exec();
  console.log(`Found ${ads.length} ads. Updating URLs...`);

  for (const ad of ads) {
    if (ad.adCode === 'AD_101') {
      ad.youtubeUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      await ad.save();
      console.log('Updated AD_101 to direct mp4 link.');
    } else if (ad.adCode === 'AD_102') {
      ad.youtubeUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
      await ad.save();
      console.log('Updated AD_102 to direct mp4 link.');
    } else if (ad.adCode === 'AD_103') {
      ad.youtubeUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      await ad.save();
      console.log('Updated AD_103 to direct mp4 link.');
    } else if (ad.youtubeUrl.includes('youtube.com') || ad.youtubeUrl.includes('youtu.be')) {
      // Fallback fallback link for generic youtube links
      ad.youtubeUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      await ad.save();
      console.log(`Updated ad "${ad.title}" to generic direct mp4 link.`);
    }
  }

  console.log('Migration completed successfully!');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
