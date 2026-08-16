import { Store } from '../models/Store';
import { Advertiser } from '../models/Advertiser';
import { TV } from '../models/TV';
import { Ad } from '../models/Ad';
import { logger } from './logger';

export async function seedDatabase() {
  try {
    const storeCount = await Store.count();
    if (storeCount > 0) {
      return; // Already seeded
    }

    logger.info('Database empty, seeding initial rich sample data...');

    // 1. Seed Stores
    const stores = await Store.bulkCreate([
      { name: 'Broadway Outlet', location: 'New York City', storeCode: 'STR_101' },
      { name: 'Sunset Plaza Mall', location: 'Los Angeles', storeCode: 'STR_102' },
      { name: 'Michigan Avenue Flagship', location: 'Chicago', storeCode: 'STR_103' },
    ]);

    // 2. Seed Advertisers
    const advertisers = await Advertiser.bulkCreate([
      { name: 'Nike Retail Inc.', email: 'sponsorships@nike.com', phone: '+1-800-806-6453', advertiserCode: 'ADV_101' },
      { name: 'Coca-Cola Brands', email: 'ads@coca-cola.com', phone: '+1-800-438-2653', advertiserCode: 'ADV_102' },
      { name: 'Samsung Electronics', email: 'display-partners@samsung.com', phone: '+1-800-726-7864', advertiserCode: 'ADV_103' },
    ]);

    // 3. Seed TV Screens
    await TV.bulkCreate([
      {
        name: 'Main Cashier display',
        tvCode: 'TV-101',
        storeId: stores[0].id,
        status: 'offline',
        brand: 'Samsung 55" Display Panel',
        serialNumber: 'SNG-55-10294A',
        purchaseDate: '2025-11-12',
        notes: 'Mounted above registry 1. Warranty covers replacement till 2028.'
      },
      {
        name: 'Window Entrance Billboard',
        tvCode: 'TV-102',
        storeId: stores[0].id,
        status: 'offline',
        brand: 'Sony Bravia 65"',
        serialNumber: 'SNY-65-88301B',
        purchaseDate: '2026-02-04',
        notes: 'High brightness screen for outdoor window visibility.'
      },
      {
        name: 'Apparel Section Display',
        tvCode: 'TV-103',
        storeId: stores[1].id,
        status: 'offline',
        brand: 'TCL 50" Smart TV',
        serialNumber: 'TCL-50-99302C',
        purchaseDate: '2026-05-18',
        notes: 'Suspended from ceiling girder.'
      }
    ]);

    // 4. Seed Campaigns
    await Ad.bulkCreate([
      {
        title: 'Nike - Play New Campaign',
        youtubeUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: 30,
        advertiserId: advertisers[0].id,
        adCode: 'AD_101'
      },
      {
        title: 'Coca-Cola - Masterpiece 2026',
        youtubeUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: 45,
        advertiserId: advertisers[1].id,
        adCode: 'AD_102'
      },
      {
        title: 'Samsung Galaxy - Join the Flip Side',
        youtubeUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: 30,
        advertiserId: advertisers[2].id,
        adCode: 'AD_103'
      }
    ]);

    logger.info('Database seeding completed successfully!');
  } catch (err) {
    logger.error('Failed to seed database:', err);
  }
}
