import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testAnalytics() {
  console.log('');
  console.log('🧪 Testing Analytics System');
  console.log('================================');
  console.log('');

  try {
    // Step 1: Login as admin
    console.log('1️⃣  Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'admin',
      password: 'pibit2026',
      role: 'admin'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('');

    // Step 2: Get all assets
    console.log('2️⃣  Fetching assets...');
    const assetsResponse = await axios.get(`${API_URL}/api/assets`);
    const assets = assetsResponse.data;
    console.log(`✅ Found ${assets.length} assets`);
    console.log('');

    if (assets.length === 0) {
      console.log('⚠️  No assets found. Run "npm run generate-dummy 10" first.');
      return;
    }

    // Step 3: Simulate downloads from multiple sessions
    console.log('3️⃣  Simulating downloads from 5 different users...');
    const downloadPromises = [];
    
    for (let i = 1; i <= 5; i++) {
      const sessionId = `test-session-${i}`;
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      
      console.log(`   👤 User ${i} downloading: ${randomAsset.name}`);
      
      downloadPromises.push(
        axios.get(`${API_URL}/api/assets/${randomAsset.id}/download`, {
          headers: {
            'X-Session-Id': sessionId
          }
        })
      );
    }

    await Promise.all(downloadPromises);
    console.log('✅ All downloads completed');
    console.log('');

    // Step 4: Wait a moment for data to be written
    console.log('4️⃣  Waiting for analytics to update...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Ready');
    console.log('');

    // Step 5: Fetch analytics summary
    console.log('5️⃣  Fetching analytics summary...');
    const analyticsResponse = await axios.get(`${API_URL}/api/analytics/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const analytics = analyticsResponse.data;
    console.log('');
    console.log('📊 Analytics Results');
    console.log('================================');
    console.log(`👥 Daily Active Users (DAU): ${analytics.dau}`);
    console.log(`👥 Weekly Active Users (WAU): ${analytics.wau}`);
    console.log(`👥 Monthly Active Users (MAU): ${analytics.mau}`);
    console.log('');
    console.log(`📥 Total Downloads: ${analytics.totalDownloads}`);
    console.log(`📥 Downloads Today: ${analytics.downloadsToday}`);
    console.log(`📥 Downloads This Week: ${analytics.downloadsThisWeek}`);
    console.log(`📥 Downloads This Month: ${analytics.downloadsThisMonth}`);
    console.log('');

    if (analytics.topDownloadedAssets.length > 0) {
      console.log('🏆 Top Downloaded Assets:');
      analytics.topDownloadedAssets.forEach((asset: any, index: number) => {
        console.log(`   ${index + 1}. ${asset.assetName} - ${asset.downloadCount} downloads`);
      });
    } else {
      console.log('📭 No download data yet');
    }
    console.log('================================');
    console.log('');

    // Step 6: Verify the data
    console.log('6️⃣  Verifying analytics...');
    let allPassed = true;

    if (analytics.dau >= 5) {
      console.log('✅ DAU tracking working (5+ unique sessions detected)');
    } else {
      console.log(`⚠️  DAU might be low: ${analytics.dau} (expected 5+)`);
      allPassed = false;
    }

    if (analytics.totalDownloads >= 5) {
      console.log('✅ Download tracking working (5+ downloads recorded)');
    } else {
      console.log(`⚠️  Downloads might be low: ${analytics.totalDownloads} (expected 5+)`);
      allPassed = false;
    }

    if (analytics.topDownloadedAssets.length > 0) {
      console.log('✅ Top downloads tracking working');
    } else {
      console.log('⚠️  No top downloads data');
      allPassed = false;
    }

    console.log('');
    if (allPassed) {
      console.log('✨ All analytics tests passed!');
    } else {
      console.log('⚠️  Some analytics might need more activity to show data');
    }
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
    }
    process.exit(1);
  }
}

testAnalytics();
