import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000';
const CONCURRENT_USERS = 20;
const REQUESTS_PER_USER = 10;

interface TestResult {
  userId: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
}

async function simulateUser(userId: number): Promise<TestResult> {
  const responseTimes: number[] = [];
  let successCount = 0;
  let failCount = 0;

  console.log(`👤 User ${userId} starting...`);

  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    const startTime = Date.now();
    
    try {
      // Simulate different types of requests
      const requestType = Math.floor(Math.random() * 4);
      
      switch (requestType) {
        case 0:
          // Get all assets
          await axios.get(`${API_URL}/api/assets`);
          break;
        case 1:
          // Get categories
          await axios.get(`${API_URL}/api/categories`);
          break;
        case 2:
          // Get assets by category
          const categories = ['Logos', 'Brand Guidelines', 'Templates', 'Images'];
          const category = categories[Math.floor(Math.random() * categories.length)];
          await axios.get(`${API_URL}/api/assets/category/${encodeURIComponent(category)}`);
          break;
        case 3:
          // Health check
          await axios.get(`${API_URL}/health`);
          break;
      }
      
      const responseTime = Date.now() - startTime;
      responseTimes.push(responseTime);
      successCount++;
      
    } catch (error) {
      failCount++;
      console.error(`❌ User ${userId} request ${i + 1} failed:`, (error as any).message);
    }
    
    // Small delay between requests (100-500ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));
  }

  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);

  console.log(`✅ User ${userId} completed: ${successCount}/${REQUESTS_PER_USER} successful`);

  return {
    userId,
    totalRequests: REQUESTS_PER_USER,
    successfulRequests: successCount,
    failedRequests: failCount,
    averageResponseTime: avgResponseTime,
    minResponseTime,
    maxResponseTime
  };
}

async function runLoadTest(): Promise<void> {
  console.log('');
  console.log('🚀 Starting Load Test');
  console.log('================================');
  console.log(`🌐 API URL: ${API_URL}`);
  console.log(`👥 Concurrent Users: ${CONCURRENT_USERS}`);
  console.log(`📊 Requests per User: ${REQUESTS_PER_USER}`);
  console.log(`📈 Total Requests: ${CONCURRENT_USERS * REQUESTS_PER_USER}`);
  console.log('================================');
  console.log('');

  const startTime = Date.now();

  // Create array of user simulations
  const userPromises: Promise<TestResult>[] = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i));
  }

  // Run all users concurrently
  const results = await Promise.all(userPromises);

  const totalTime = Date.now() - startTime;

  // Calculate aggregate statistics
  const totalRequests = results.reduce((sum, r) => sum + r.totalRequests, 0);
  const totalSuccessful = results.reduce((sum, r) => sum + r.successfulRequests, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failedRequests, 0);
  const avgResponseTime = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;
  const minResponseTime = Math.min(...results.map(r => r.minResponseTime));
  const maxResponseTime = Math.max(...results.map(r => r.maxResponseTime));
  const requestsPerSecond = (totalSuccessful / (totalTime / 1000)).toFixed(2);

  console.log('');
  console.log('📊 Load Test Results');
  console.log('================================');
  console.log(`⏱️  Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`✅ Successful Requests: ${totalSuccessful}/${totalRequests}`);
  console.log(`❌ Failed Requests: ${totalFailed}`);
  console.log(`📈 Success Rate: ${((totalSuccessful / totalRequests) * 100).toFixed(2)}%`);
  console.log(`⚡ Requests/Second: ${requestsPerSecond}`);
  console.log('');
  console.log('Response Times:');
  console.log(`  Average: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`  Min: ${minResponseTime}ms`);
  console.log(`  Max: ${maxResponseTime}ms`);
  console.log('================================');
  console.log('');

  if (totalFailed === 0) {
    console.log('✨ All requests completed successfully!');
  } else {
    console.log(`⚠️  ${totalFailed} requests failed. Check server logs for details.`);
  }
}

// Run the load test
runLoadTest().catch(error => {
  console.error('❌ Load test failed:', error);
  process.exit(1);
});
