const { MongoClient } = require('mongodb');

async function run() {
  const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/pibit-cms';
  const client = new MongoClient(dbUrl);
  
  try {
    await client.connect();
    // Extract database name from URL
    const dbName = dbUrl.split('/').pop().split('?')[0] || 'pibit-cms';
    const db = client.db(dbName);
    const collection = db.collection('assets');
    
    console.log('Searching for absolute URLs in ' + dbName + '...');
    const assets = await collection.find({}).toArray();
    let count = 0;
    
    for (const asset of assets) {
      if (asset.url && (asset.url.includes('localhost:3000') || asset.url.includes('onrender.com'))) {
        // Keep original if it's not starting with http - but here we want to strip the domain
        const relativeUrl = asset.url.replace(/^https?:\/\/[^/]+/, '');
        
        if (relativeUrl !== asset.url) {
          await collection.updateOne(
            { _id: asset._id },
            { $set: { url: relativeUrl } }
          );
          console.log(`Updated "${asset.name}": ${asset.url} -> ${relativeUrl}`);
          count++;
        }
      }
    }
    
    console.log('\n✅ Successfully sanitized ' + count + ' asset URLs.');
  } catch (error) {
    console.error('Error during sanitization:', error);
  } finally {
    await client.close();
  }
}

run();
