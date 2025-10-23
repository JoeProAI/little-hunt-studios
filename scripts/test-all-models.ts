/**
 * Automated Model Testing Suite
 * Tests all 26 video models with their parameter combinations
 * Automatically saves successful videos to Firebase as demo content
 * 
 * Usage:
 *   npm run test:models -- --userId=YOUR_USER_ID
 * 
 * Options:
 *   --userId: Your Firebase user ID (required)
 */

import { generateVideoWithReplicate, REPLICATE_VIDEO_MODELS, MODEL_DURATION_OPTIONS } from '../src/lib/replicate-api';
import { getModelCredits, getModelTier } from '../src/lib/model-pricing';
import { getAdminDb } from '../src/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface TestResult {
  model: string;
  modelName: string;
  duration: string;
  tier: string;
  credits: number;
  status: 'success' | 'failed' | 'skipped';
  videoUrl?: string;
  error?: string;
  timeTaken?: number;
}

const TEST_PROMPTS = {
  short: "A serene sunset over mountains with golden clouds",
  medium: "A person walking through a bustling city street at night with neon lights reflecting on wet pavement",
  long: "An epic cinematic shot starting with a close-up of dewdrops on a leaf, slowly pulling back to reveal a vast forest canopy at sunrise"
};

/**
 * Save demo video to Firebase
 */
async function saveDemoVideo(
  userId: string,
  modelId: string,
  modelName: string,
  videoUrl: string,
  duration: string,
  prompt: string,
  credits: number
): Promise<void> {
  try {
    const db = getAdminDb();
    
    await db.collection('videos').add({
      userId,
      type: 'video',
      url: videoUrl,
      thumbnailUrl: videoUrl,
      prompt,
      model: modelId,
      modelName,
      duration,
      aspectRatio: '16:9',
      status: 'completed',
      replicateId: `demo_${Date.now()}`,
      creditsCost: 0, // Demo videos don't cost user credits
      isDemo: true, // Mark as demo video
      createdAt: FieldValue.serverTimestamp(),
    });
    
    console.log(`   💾 Saved to Firebase as demo video`);
  } catch (error: any) {
    console.error(`   ⚠️  Failed to save to Firebase: ${error.message}`);
  }
}

async function testModel(
  modelId: string,
  duration: string,
  userId?: string
): Promise<TestResult> {
  const modelName = REPLICATE_VIDEO_MODELS[modelId as keyof typeof REPLICATE_VIDEO_MODELS];
  const tier = getModelTier(modelId);
  const credits = getModelCredits(modelId);
  
  console.log(`\n🧪 Testing: ${modelName} (${duration})`);
  console.log(`   Tier: ${tier.tier} | Credits: ${credits}`);
  
  const startTime = Date.now();
  
  try {
    // Select prompt based on duration
    let prompt = TEST_PROMPTS.short;
    if (duration === '10s' || duration === '9s') {
      prompt = TEST_PROMPTS.long;
    } else if (duration === '8s' || duration === '6s') {
      prompt = TEST_PROMPTS.medium;
    }
    
    const result = await generateVideoWithReplicate({
      prompt,
      duration,
      aspect_ratio: '16:9',
      model: modelId,
    });
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    if (result.status === 'succeeded' && result.video_url) {
      console.log(`   ✅ SUCCESS in ${timeTaken}s`);
      console.log(`   Video URL: ${result.video_url}`);
      
      // Save to Firebase if userId provided
      if (userId) {
        await saveDemoVideo(
          userId,
          modelId,
          modelName,
          result.video_url,
          duration,
          prompt,
          credits
        );
      }
      
      return {
        model: modelId,
        modelName,
        duration,
        tier: tier.tier,
        credits,
        status: 'success',
        videoUrl: result.video_url,
        timeTaken,
      };
    } else {
      console.log(`   ❌ FAILED: ${result.error || 'Unknown error'}`);
      
      return {
        model: modelId,
        modelName,
        duration,
        tier: tier.tier,
        credits,
        status: 'failed',
        error: result.error || 'Generation failed',
        timeTaken,
      };
    }
  } catch (error: any) {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    console.log(`   ❌ ERROR: ${error.message}`);
    
    return {
      model: modelId,
      modelName,
      duration,
      tier: tier.tier,
      credits,
      status: 'failed',
      error: error.message,
      timeTaken,
    };
  }
}

async function runAllTests(userId?: string) {
  const results: TestResult[] = [];
  const modelIds = Object.keys(REPLICATE_VIDEO_MODELS);
  
  console.log('🚀 Starting Automated Model Testing Suite');
  console.log(`📊 Testing ${modelIds.length} models`);
  console.log('=' .repeat(60));
  
  let totalTests = 0;
  let successCount = 0;
  let failCount = 0;
  
  for (const modelId of modelIds) {
    const durations = MODEL_DURATION_OPTIONS[modelId] || ['5s'];
    
    // Test shortest and longest duration for each model
    const durationsToTest = durations.length === 1 
      ? [durations[0]] 
      : [durations[0], durations[durations.length - 1]];
    
    for (const duration of durationsToTest) {
      totalTests++;
      const result = await testModel(modelId, duration, userId);
      results.push(result);
      
      if (result.status === 'success') {
        successCount++;
      } else {
        failCount++;
      }
      
      // Wait 2 seconds between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${successCount} (${Math.round(successCount/totalTests*100)}%)`);
  console.log(`❌ Failed: ${failCount} (${Math.round(failCount/totalTests*100)}%)`);
  
  // Group results by tier
  const byTier = {
    premium: results.filter(r => r.tier === 'premium'),
    'mid-range': results.filter(r => r.tier === 'mid-range'),
    budget: results.filter(r => r.tier === 'budget'),
  };
  
  console.log('\n📈 RESULTS BY TIER:');
  for (const [tier, tierResults] of Object.entries(byTier)) {
    const tierSuccess = tierResults.filter(r => r.status === 'success').length;
    console.log(`\n${tier.toUpperCase()}: ${tierSuccess}/${tierResults.length} passed`);
  }
  
  // Show failures
  const failures = results.filter(r => r.status === 'failed');
  if (failures.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failures.forEach(f => {
      console.log(`   • ${f.modelName} (${f.duration}): ${f.error}`);
    });
  }
  
  // Show successes with URLs
  const successes = results.filter(r => r.status === 'success');
  if (successes.length > 0) {
    console.log('\n✅ SUCCESSFUL TESTS (Demo Videos):');
    successes.forEach(s => {
      console.log(`   • ${s.modelName} (${s.duration}): ${s.videoUrl}`);
    });
  }
  
  // Save results to JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fs = require('fs');
  const path = require('path');
  const resultsPath = path.join(__dirname, `../test-results-${timestamp}.json`);
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: successCount,
      failed: failCount,
      successRate: `${Math.round(successCount/totalTests*100)}%`
    },
    results,
  }, null, 2));
  
  console.log(`\n💾 Results saved to: ${resultsPath}`);
  
  return results;
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const userIdArg = args.find(arg => arg.startsWith('--userId='));
  const userId = userIdArg?.split('=')[1];
  
  if (!userId) {
    console.error('❌ Error: --userId is required');
    console.log('Usage: npm run test:models -- --userId=YOUR_USER_ID');
    process.exit(1);
  }
  
  runAllTests(userId)
    .then(() => {
      console.log('\n✅ All tests completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test suite failed:', error);
      process.exit(1);
    });
}

export { runAllTests, testModel };
