// Test script for API endpoints
// Run with: node test-api.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testImageGeneration() {
  console.log('\n🎨 Testing Image Generation API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'A serene mountain landscape at golden hour with dramatic clouds',
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Image Generation SUCCESS');
      console.log('   ID:', data.id);
      console.log('   URL:', data.url ? '✓ Present' : '✗ Missing');
      console.log('   Created:', new Date(data.created_at).toISOString());
      return true;
    } else {
      console.log('❌ Image Generation FAILED');
      console.log('   Error:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Image Generation ERROR');
    console.log('   ', error.message);
    return false;
  }
}

async function testVideoGeneration() {
  console.log('\n🎬 Testing Video Generation API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/sora/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'A cinematic dolly shot through a mystical forest, sunbeams filtering through trees',
        duration: '5s',
        aspect_ratio: '16:9',
        num_outputs: 1
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Video Generation SUCCESS');
      console.log('   ID:', data.id);
      console.log('   Status:', data.status);
      console.log('   Progress:', data.progress + '%');
      console.log('   Created:', new Date(data.created_at).toISOString());
      return true;
    } else {
      console.log('❌ Video Generation FAILED');
      console.log('   Error:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Video Generation ERROR');
    console.log('   ', error.message);
    return false;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════');
  console.log('  Little Hunt Studios - API Endpoint Tests');
  console.log('═══════════════════════════════════════════════');
  console.log('  Target:', BASE_URL);
  console.log('═══════════════════════════════════════════════');

  const imageSuccess = await testImageGeneration();
  const videoSuccess = await testVideoGeneration();

  console.log('\n═══════════════════════════════════════════════');
  console.log('  Test Summary');
  console.log('═══════════════════════════════════════════════');
  console.log('  Image API:', imageSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('  Video API:', videoSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('═══════════════════════════════════════════════\n');

  process.exit(imageSuccess && videoSuccess ? 0 : 1);
}

runTests();
