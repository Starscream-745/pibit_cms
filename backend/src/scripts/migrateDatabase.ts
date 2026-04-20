import { MongoClient } from 'mongodb';

const LOCAL_URI = 'mongodb://localhost:27017/pibit-cms';
const REMOTE_URI = 'mongodb+srv://kushagra2226it1035_db_user:m8eNsz83LYCynTQP@pibit.ggloc3w.mongodb.net/pibit-cms?appName=pibit';

async function migrateData() {
  console.log('🔄 Starting Database Migration...');
  
  const localClient = new MongoClient(LOCAL_URI);
  const remoteClient = new MongoClient(REMOTE_URI);

  try {
    console.log('📡 Connecting to Local Database...');
    await localClient.connect();
    const localDb = localClient.db('pibit-cms');

    console.log('☁️ Connecting to MongoDB Atlas...');
    await remoteClient.connect();
    const remoteDb = remoteClient.db('pibit-cms');

    // Get all collections from the local database
    const collections = await localDb.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections to migrate.`);

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n▶️ Migrating collection: ${collectionName}...`);

      const localCol = localDb.collection(collectionName);
      const remoteCol = remoteDb.collection(collectionName);

      // Fetch all documents from local
      const documents = await localCol.find({}).toArray();
      
      if (documents.length === 0) {
        console.log(`   ⏭️ Collection is empty. Skipping.`);
        continue;
      }

      console.log(`   📥 Found ${documents.length} documents.`);

      // Clear the remote collection first just in case
      await remoteCol.deleteMany({});
      
      // Insert into remote
      await remoteCol.insertMany(documents);
      console.log(`   ✅ Successfully copied ${documents.length} documents!`);
    }

    console.log('\n🎉 MIGRATION COMPLETE! Your Cloud Database is now identical to your Local Database.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await localClient.close();
    await remoteClient.close();
  }
}

migrateData();
