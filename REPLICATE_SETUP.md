# 🚀 Replicate API Setup

## ✨ What is Replicate?

Replicate gives you access to **multiple AI video and image generation models** through a single API. This opens up many more options beyond just Sora!

### Available Video Models on Replicate:
- **MiniMax Video-01** - Fast, good quality video generation
- **Hunyuan Video** - High-quality video from Tencent
- **Mochi-1** - Experimental video model
- ...and more!

### Available Image Models on Replicate:
- **FLUX Schnell** - Fast image generation
- **FLUX Dev** - High-quality images
- **FLUX Pro** - Best quality (premium)

---

## 🔑 Setup Instructions

### Step 1: Get Your Replicate API Token

1. Go to https://replicate.com/account/api-tokens
2. Sign up or log in
3. Copy your API token: `r8_XXXXXXXXXXXX...`

### Step 2: Add to Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/joeproai/little-hunt-studios
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `REPLICATE_API_TOKEN`
   - **Value**: `r8_XXXXXXXXXXXX...` (paste your Replicate token here)
   - **Environments**: Production, Preview, Development
4. Click **Save**

### Step 3: Redeploy

Vercel will automatically redeploy with the new environment variable.

---

## 🎬 How to Use

### In the App:

1. Go to the **Generate** tab
2. At the top right, you'll see **"API Provider"** dropdown
3. Select between:
   - **Replicate** (MiniMax, Hunyuan) - ✅ More likely to work!
   - **OpenAI** (Sora 2) - Still available if you have access

### Generate a Video:

1. Build your prompt in the Prompt Builder
2. Select **Replicate** as the API provider
3. Click **Generate Video**
4. Watch it process!

---

## 💡 Why Use Replicate?

### Advantages:
✅ **Multiple Models** - Not locked into one provider  
✅ **Better Availability** - Less likely to be at capacity  
✅ **Cost Effective** - Pay-as-you-go pricing  
✅ **Easy to Use** - Simple API  
✅ **More Options** - Switch models anytime  

### Pricing:
- **MiniMax Video-01**: ~$0.05-0.10 per video
- **FLUX images**: ~$0.003-0.01 per image
- Check https://replicate.com/pricing for latest

---

## 🔧 Technical Details

### API Endpoints Created:

**Generate Video:**
```
POST /api/replicate/generate
Body: {
  "prompt": "your prompt here",
  "duration": "5s",
  "aspect_ratio": "16:9"
}
```

**Check Status:**
```
GET /api/replicate/status/[prediction_id]
```

### Files Added:
- `src/lib/replicate-api.ts` - Replicate API client
- `src/app/api/replicate/generate/route.ts` - Generation endpoint
- `src/app/api/replicate/status/[id]/route.ts` - Status checking

### OpenAI Code:
✅ **All OpenAI code is preserved**  
✅ **You can switch between APIs anytime**  
✅ **Both APIs work side-by-side**  

---

## 🧪 Testing

### Test Video Generation:
```bash
curl -X POST https://little-hunt-studios.vercel.app/api/replicate/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cinematic shot of mountains at sunset",
    "duration": "5s",
    "aspect_ratio": "16:9"
  }'
```

### Check Status:
```bash
curl https://little-hunt-studios.vercel.app/api/replicate/status/[prediction_id]
```

---

## 🎯 Next Steps

1. ✅ Add `REPLICATE_API_TOKEN` to Vercel
2. ✅ Wait for redeploy (~2 min)
3. ✅ Test video generation with Replicate
4. ✅ Enjoy multiple AI models!

---

## 📚 Resources

- Replicate Docs: https://replicate.com/docs
- Node.js SDK: https://github.com/replicate/replicate-javascript
- Available Models: https://replicate.com/explore

---

## 🎉 You're All Set!

Now you have access to:
- ✅ OpenAI Sora 2 (when available)
- ✅ MiniMax Video-01
- ✅ Hunyuan Video
- ✅ FLUX image models
- ✅ And many more to come!

Switch between them easily with the dropdown! 🚀
