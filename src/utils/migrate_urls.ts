import { sequelize } from '../config/db';
import { Ad } from '../models/Ad';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function migrate() {
  console.log('Connecting to database...');
  await sequelize.authenticate();
  console.log('Connected!');

  const ads = await Ad.findAll();
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
      ad.youtubeUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      await ad.save();
      console.log(`Updated ad "${ad.title}" to generic direct mp4 link.`);
    }
  }

  console.log('Migration completed successfully!');
  await sequelize.close();
}

migrate().catch(async err => {
  console.error('Migration failed:', err);
  await sequelize.close();
  process.exit(1);
});
