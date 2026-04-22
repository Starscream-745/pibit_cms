const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient('mongodb+srv://kushagra2226it1035_db_user:m8eNsz83LYCynTQP@pibit.ggloc3w.mongodb.net/pibit-cms?appName=pibit');
  await client.connect();
  const db = client.db('pibit-cms');
  const assets = await db.collection('assets').find().toArray();
  let updated = 0;
  for (const a of assets) {
    if (a.url && a.url.startsWith('http://localhost:3000')) {
      const newUrl = a.url.replace('http://localhost:3000', '');
      await db.collection('assets').updateOne({_id: a._id}, { $set: {url: newUrl} });
      updated++;
    }
  }
  console.log('Updated', updated, 'assets');
  await client.close();
}

run().catch(console.dir);
