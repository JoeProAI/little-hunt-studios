/**
 * Quick Model Validation Script
 * Tests one configuration per model (shortest duration)
 * Faster than full test suite
 * 
 * Usage: npx tsx scripts/test-models-quick.ts
 */

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

interface QuickTestResult {
  model: string;
  status: 'pass' | 'fail';
  error?: string;
  duration?: number;
}

const MODELS_TO_TEST = [
  // Premium
  { id: 'openai/sora-2-pro', params: { prompt: 'A sunset', duration: '5s' } },
  { id: 'google/veo-3.1', params: { prompt: 'A sunset', duration: 4, aspect_ratio: '16:9', generate_audio: true } },
  
  // Mid-range
  { id: 'pixverse/pixverse-v5', params: { prompt: 'A sunset', duration: 5, resolution: '1080p', aspect_ratio: '16:9' } },
  { id: 'minimax/hailuo-02', params: { prompt: 'A sunset', duration: 6, quality: 'pro', aspect_ratio: '16:9' } },
  { id: 'bytedance/seedance-1-pro', params: { prompt: 'A sunset', duration: 5, resolution: '1080p', aspect_ratio: '16:9' } },
  { id: 'kwaivgi/kling-v2.5-turbo-pro', params: { prompt: 'A sunset', duration: 5, aspect_ratio: '16:9' } },
  { id: 'minimax/video-01', params: { prompt: 'A sunset', num_frames: 150, aspect_ratio: '16:9' } },
  { id: 'wan-video/wan-2.5-t2v', params: { prompt: 'A sunset', duration: 5, aspect_ratio: '16:9' } },
  
  // Budget
  { id: 'luma/ray-flash-2-720p', params: { prompt: 'A sunset', duration: 5 } },
  { id: 'luma/ray', params: { prompt: 'A sunset', duration: '5s', aspect_ratio: '16:9' } },
  { id: 'kwaivgi/kling-v1.6-pro', params: { prompt: 'A sunset', duration: 5, aspect_ratio: '16:9' } },
];

async function quickTest(modelConfig: any): Promise<QuickTestResult> {
  const startTime = Date.now();
  
  try {
    console.log(`Testing ${modelConfig.id}...`);
    
    const output = await replicate.run(
      modelConfig.id as any,
      { input: modelConfig.params }
    );
    
    const duration = Date.now() - startTime;
    console.log(`  ✅ PASS (${Math.round(duration/1000)}s)`);
    
    return {
      model: modelConfig.id,
      status: 'pass',
      duration: Math.round(duration/1000),
    };
  } catch (error: any) {
    console.log(`  ❌ FAIL: ${error.message}`);
    
    return {
      model: modelConfig.id,
      status: 'fail',
      error: error.message,
    };
  }
}

async function runQuickTests() {
  console.log('🚀 Quick Model Validation\n');
  
  const results: QuickTestResult[] = [];
  
  for (const model of MODELS_TO_TEST) {
    const result = await quickTest(model);
    results.push(result);
    
    // Wait 1 second between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total: ${results.length}`);
  console.log(`✅ Passed: ${passed} (${Math.round(passed/results.length*100)}%)`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed models:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`  • ${r.model}: ${r.error}`);
    });
  }
  
  return results;
}

// Run
if (!process.env.REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN not set');
  process.exit(1);
}

runQuickTests()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
