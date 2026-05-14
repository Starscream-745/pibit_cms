const { MongoClient } = require('mongodb');
require('dotenv').config();

function toTitleCase(str) {
  if (!str) return str;
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

async function run() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('assets');
    
    const assets = await collection.find({}).toArray();
    for (const asset of assets) {
      let updated = false;
      let newName = asset.name;
      let newCategory = asset.category;
      
      if (typeof newName === 'string') {
        newName = newName.replace(/PIBIT/g, 'Pibit');
        newName = newName.replace(/Pibit\.Ai/g, 'Pibit.ai');
        newName = newName.replace(/Pibit\.AI/g, 'Pibit.ai');
        if (newName !== asset.name) updated = true;
      }
      
      if (typeof newCategory === 'string') {
        const titleCategory = toTitleCase(newCategory);
        if (newCategory !== titleCategory) {
          newCategory = titleCategory;
          updated = true;
        }
      }
      
      if (updated) {
        await collection.updateOne({ _id: asset._id }, { $set: { name: newName, category: newCategory } });
        console.log(`Updated ${asset._id} - Name: ${newName}, Category: ${newCategory}`);
      }
    }
    
    console.log('Database fix complete.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
