// Test image generation only
// Run with: BASE_URL=https://little-hunt-studios.vercel.app node test-image-only.js

const BASE_URL = process.env.BASE_URL || 'https://little-hunt-studios.vercel.app';

async function testImageGeneration() {
  console.log('\n🎨 Testing Image Generation API...');
  console.log('   URL:', `${BASE_URL}/api/image/generate`);
  
  try {
    console.log('   Sending request...');
    const response = await fetch(`${BASE_URL}/api/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'A serene mountain landscape at golden hour with dramatic clouds, cinematic photography',
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid'
      })
    });

    console.log('   Status:', response.status);
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! Image Generated');
      console.log('   ID:', data.id);
      console.log('   URL:', data.url ? data.url.substring(0, 60) + '...' : '✗ Missing');
      console.log('   Revised Prompt:', data.revised_prompt ? 'Yes' : 'No');
      console.log('   Created:', new Date(data.created_at).toISOString());
      console.log('\n   Full URL:', data.url);
      return true;
    } else {
      console.log('\n❌ FAILED');
      console.log('   Error:', data.error);
      return false;
    }
  } catch (error) {
    console.log('\n❌ ERROR');
    console.log('   ', error.message);
    return false;
  }
}

testImageGeneration().then(success => {
  process.exit(success ? 0 : 1);
});
