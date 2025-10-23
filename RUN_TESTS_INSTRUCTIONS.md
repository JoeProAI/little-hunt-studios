# How to Run Full Model Tests with Firebase Integration

## Prerequisites

1. **Environment Variables Set** (in `.env.local`):
   ```env
   REPLICATE_API_TOKEN=r8_your_token_here
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@little-hunt-studios.iam.gserviceaccount.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=little-hunt-studios
   ```

2. **Your Firebase User ID**:
   - Find it in Firebase Console → Authentication
   - Or from your app: `console.log(user.uid)`

---

## Running the Tests

### Option 1: PowerShell Script (Windows - Easiest)

```powershell
.\scripts\run-tests.ps1 YOUR_USER_ID
```

The script will:
- ✅ Check environment variables
- ✅ Show cost estimate
- ✅ Ask for confirmation
- ✅ Run all tests
- ✅ Auto-save videos to Firebase
- ✅ Generate JSON report

### Option 2: Direct Command

```bash
npm run test:models -- --userId=YOUR_USER_ID
```

---

## What Happens

### During Tests (~1-2 hours):

```
🚀 Starting Automated Model Testing Suite
📊 Testing 26 models
============================================================

🧪 Testing: Sora-2 Pro (5s)
   Tier: premium | Credits: 3
   ✅ SUCCESS in 45s
   Video URL: https://replicate.delivery/...
   💾 Saved to Firebase as demo video

🧪 Testing: Pixverse v5 (5s)
   Tier: mid-range | Credits: 2
   ✅ SUCCESS in 32s
   Video URL: https://replicate.delivery/...
   💾 Saved to Firebase as demo video

... (continues for all 26 models)
```

### After Completion:

**1. Console Summary:**
```
============================================================
📊 TEST SUMMARY
============================================================
Total Tests: 42
✅ Passed: 40 (95%)
❌ Failed: 2 (5%)

📈 RESULTS BY TIER:
PREMIUM: 8/8 passed
MID-RANGE: 24/26 passed
BUDGET: 8/8 passed
```

**2. JSON Report:**
- Saved as: `test-results-2025-10-23T14-30-00.json`
- Contains all results, URLs, errors, timing

**3. Firebase Database:**
- All successful videos saved to `videos` collection
- Tagged with `isDemo: true`
- Linked to your user account
- Zero credits deducted from user (marked as demo)
- Immediately visible in "My Gallery"

---

## Cost & Time

| Metric | Estimate |
|--------|----------|
| **Total Tests** | 42 (26 models × ~1.6 durations each) |
| **Time** | 1-2 hours |
| **Replicate Cost** | $10-15 |
| **App Credits** | 0 (saved as demos) |
| **Videos Generated** | ~40 successful |

---

## Using Demo Videos

### 1. View in Your Gallery
- Go to app → "My Gallery"
- Filter by your user ID
- All demo videos will be there

### 2. Add to Model Selection Page

Update `src/app/select-model/page.tsx`:

```typescript
const FEATURED_MODELS: ModelOption[] = [
  {
    id: 'openai/sora-2-pro',
    name: 'Sora-2 Pro',
    demoVideoUrl: 'https://replicate.delivery/...',  // ← Add this
    description: '...',
    features: ['...'],
  },
  // ... more models
];
```

### 3. Export for Marketing

```bash
# Extract all video URLs from results
cat test-results-*.json | jq '.results[] | select(.status=="success") | {model, videoUrl}'
```

---

## Troubleshooting

### "REPLICATE_API_TOKEN not set"
**Fix:** Add to `.env.local`:
```env
REPLICATE_API_TOKEN=r8_your_token_here
```

### "Firebase Admin credentials not set"
**Fix:** Add to `.env.local`:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
```

### "User not found"
**Fix:** Use correct Firebase Auth user ID
- Check Firebase Console → Authentication
- Copy exact UID

### Tests Timing Out
**Fix:** Increase timeout or run in smaller batches
- Some models take 2-3 minutes per video
- Long durations take longer
- This is normal

### Firebase Save Fails
**Fix:** Check Firestore rules allow writes
- Rules should allow authenticated writes
- Or admin SDK should bypass rules

---

## After Tests Complete

### 1. Review Results
```bash
# View summary
cat test-results-*.json | jq '.summary'

# View failures only
cat test-results-*.json | jq '.results[] | select(.status=="failed")'

# Count by tier
cat test-results-*.json | jq '.results | group_by(.tier) | map({tier: .[0].tier, count: length})'
```

### 2. Update Documentation
- Note which models work
- Document any special constraints
- Update `MODEL_API_VERIFICATION.md`

### 3. Fix Failures
- Check error messages
- Update parameter logic in `replicate-api.ts`
- Re-run tests for those models

### 4. Deploy
- Commit any fixes
- Push to GitHub
- Vercel auto-deploys

---

## Example Complete Run

```bash
# 1. Set your user ID
$userId = "abc123xyz456"

# 2. Run tests
.\scripts\run-tests.ps1 $userId

# 3. Wait 1-2 hours...

# 4. Check results
cat test-results-*.json | jq '.summary'

# 5. View in Firebase Console
# Go to: https://console.firebase.google.com/project/little-hunt-studios/firestore
# Collection: videos
# Filter: isDemo == true

# 6. View in app
# Go to: https://your-app.vercel.app
# Navigate to: My Gallery
# See all demo videos
```

---

## Ready to Run?

1. ✅ Environment variables set
2. ✅ Firebase user ID ready
3. ✅ $10-15 Replicate credits available
4. ✅ 1-2 hours available

**Run the command:**
```powershell
.\scripts\run-tests.ps1 YOUR_USER_ID
```

**Or:**
```bash
npm run test:models -- --userId=YOUR_USER_ID
```

🚀 **Let it run and check back in an hour!**
