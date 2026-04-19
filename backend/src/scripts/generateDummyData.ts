import dotenv from 'dotenv';
import database from '../config/database';
import { AssetRepository } from '../repositories/assetRepository';
import { CreateAssetDTO } from '../models/asset';

dotenv.config();

const categories = ['Logos', 'Brand Guidelines', 'Templates', 'Images', 'Videos', 'Documents'];

const sampleUrls = {
  Logos: [
    'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Logo+1',
    'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Logo+2',
    'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Logo+3',
    'https://via.placeholder.com/400x400/FFA07A/FFFFFF?text=Logo+4',
  ],
  'Brand Guidelines': [
    'https://via.placeholder.com/800x600/96CEB4/FFFFFF?text=Brand+Guide+1',
    'https://via.placeholder.com/800x600/FFEAA7/333333?text=Brand+Guide+2',
  ],
  Templates: [
    'https://via.placeholder.com/1200x800/DFE6E9/333333?text=Template+1',
    'https://via.placeholder.com/1200x800/74B9FF/FFFFFF?text=Template+2',
  ],
  Images: [
    'https://via.placeholder.com/1920x1080/A29BFE/FFFFFF?text=Image+1',
    'https://via.placeholder.com/1920x1080/FD79A8/FFFFFF?text=Image+2',
  ],
  Videos: [
    'https://via.placeholder.com/1280x720/6C5CE7/FFFFFF?text=Video+1',
    'https://via.placeholder.com/1280x720/00B894/FFFFFF?text=Video+2',
  ],
  Documents: [
    'https://via.placeholder.com/800x1000/FDCB6E/333333?text=Document+1',
    'https://via.placeholder.com/800x1000/E17055/FFFFFF?text=Document+2',
  ]
};

const descriptions = [
  'High-quality asset for professional use',
  'Premium design resource',
  'Essential brand material',
  'Carefully crafted visual element',
  'Professional-grade content',
  'Optimized for digital and print',
  'Versatile design asset',
  'Modern and clean design',
  'Industry-standard quality',
  'Ready-to-use resource'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function generateDummyAssets(count: number = 100): Promise<void> {
  try {
    console.log('🔌 Connecting to database...');
    await database.connect();
    
    const db = database.getDb();
    const assetRepository = new AssetRepository(db);
    
    console.log(`📦 Generating ${count} dummy assets...`);
    
    const assets: CreateAssetDTO[] = [];
    
    for (let i = 1; i <= count; i++) {
      const category = getRandomElement(categories);
      const urls = sampleUrls[category as keyof typeof sampleUrls];
      
      const asset: CreateAssetDTO = {
        name: `${category} Asset ${i}`,
        url: getRandomElement(urls),
        category: category,
        description: getRandomElement(descriptions)
      };
      
      assets.push(asset);
    }
    
    // Insert in batches of 20 for better performance
    const batchSize = 20;
    for (let i = 0; i < assets.length; i += batchSize) {
      const batch = assets.slice(i, i + batchSize);
      await Promise.all(batch.map(asset => assetRepository.save(asset)));
      console.log(`✅ Inserted ${Math.min(i + batchSize, assets.length)}/${count} assets`);
    }
    
    console.log('');
    console.log('✨ Successfully generated dummy data!');
    console.log(`📊 Total assets created: ${count}`);
    console.log('');
    
    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating dummy data:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Get count from command line argument or default to 100
const count = parseInt(process.argv[2]) || 100;
generateDummyAssets(count);
