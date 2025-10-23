# Model Testing Guide

## Automated Testing Scripts

We have two testing approaches:

### 1. Quick Validation (Recommended First)
**Fast parameter validation without full video generation**

```bash
npx tsx scripts/test-models-quick.ts
```

**What it does:**
- Tests 11 representative models (premium/mid/budget mix)
- Uses shortest duration for each
- Takes ~5-10 minutes
- Uses ~5-10 Replicate credits
- Validates parameter format only

**Use when:**
- After making parameter changes
- Before deployment
- Quick smoke test

---

### 2. Full Test Suite
**Complete validation with video generation**

```bash
npm run test:models -- --userId=YOUR_USER_ID
```

**What it does:**
- Tests all 26 models
- Tests shortest + longest duration for each
- Generates actual videos
- Saves demo videos
- Creates detailed JSON report
- Takes ~1-2 hours
- Uses ~60-80 Replicate credits

**Use when:**
- Comprehensive validation needed
- Generating demo videos
- Before major release

---

## Test Results

### Output Files

**JSON Report:**
```
test-results-2025-10-23T10-30-00.json
```

Contains:
- Summary statistics
- Per-model results
- Video URLs
- Error messages
- Timing data

**Console Output:**
- Real-time test progress
- Success/failure per model
- Grouped by tier (premium/mid/budget)
- Failed tests with error messages
- Demo video URLs

---

## Example Output

```
🚀 Starting Automated Model Testing Suite
📊 Testing 26 models
============================================================

🧪 Testing: Sora-2 Pro (5s)
   Tier: premium | Credits: 3
   ✅ SUCCESS in 45s
   Video URL: https://replicate.delivery/...

🧪 Testing: Pixverse v5 (5s)
   Tier: mid-range | Credits: 2
   ✅ SUCCESS in 32s
   Video URL: https://replicate.delivery/...

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

❌ FAILED TESTS:
   • Wan 2.5 T2V (10s): Invalid duration - only supports 5s
   • Hailuo 2 (6s): Missing resolution parameter

✅ SUCCESSFUL TESTS (Demo Videos):
   • Sora-2 Pro (5s): https://replicate.delivery/...
   • Pixverse v5 (5s): https://replicate.delivery/...
   [... 38 more ...]
```

---

## Cost Estimation

### Quick Test (~11 models)
- **Replicate Credits:** $0.50 - $1.00
- **Time:** 5-10 minutes
- **App Credits Used:** 0 (direct API call)

### Full Test Suite (~42 tests)
- **Replicate Credits:** $10 - $15
- **Time:** 1-2 hours
- **App Credits Used:** 0 (bypasses app credit system)

---

## Using Demo Videos

Successful tests generate video URLs that can be used as:

1. **Model Demo Videos:** Add to `/select-model` page
2. **Marketing Material:** Show capabilities
3. **Documentation:** Visual examples
4. **Quality Benchmarks:** Compare across models

### Extracting URLs from Results

```bash
# Get all successful video URLs
cat test-results-*.json | jq '.results[] | select(.status=="success") | {model, duration, videoUrl}'
```

---

## Troubleshooting

### Common Failures

**1. Parameter Type Mismatch**
```
Error: Invalid type. Expected: integer, given: string
```
**Fix:** Check parameter types in `replicate-api.ts`

**2. Model-Specific Constraints**
```
Error: 10 seconds only available for 768p resolution
```
**Fix:** Add resolution logic for that duration

**3. Rate Limiting**
```
Error: Too many requests
```
**Fix:** Increase delay between tests (currently 2s)

**4. Authentication**
```
Error: Invalid API token
```
**Fix:** Check `REPLICATE_API_TOKEN` env var

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Models
on:
  push:
    paths:
      - 'src/lib/replicate-api.ts'
      - 'src/lib/model-pricing.ts'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:models:quick
        env:
          REPLICATE_API_TOKEN: ${{ secrets.REPLICATE_API_TOKEN }}
```

---

## Manual Testing Checklist

If you prefer manual testing, verify these for each model:

- [ ] Model ID is correct in `REPLICATE_VIDEO_MODELS`
- [ ] Duration options listed in `MODEL_DURATION_OPTIONS`
- [ ] Parameter types match API (integer vs string)
- [ ] Credit cost set in `MODEL_PRICING`
- [ ] Special constraints handled (resolution, etc.)
- [ ] Error messages are user-friendly
- [ ] Fallback values work correctly

---

## Reporting Issues

When a model fails, provide:

1. **Model ID:** e.g., `minimax/hailuo-02`
2. **Parameters sent:** From console logs
3. **Error message:** Full error from Replicate
4. **Expected behavior:** What should happen
5. **Test results file:** Attach JSON

Create issue at: [GitHub Issues](https://github.com/JoeProAI/little-hunt-studios/issues)

---

## Best Practices

1. **Run quick test first** - Catches 90% of issues in 5 min
2. **Test before deploy** - Avoid production failures
3. **Save demo videos** - Use for marketing/docs
4. **Document failures** - Track known issues
5. **Update regularly** - Models change, test quarterly

---

**Last Updated:** 2025-10-23
**Models Tested:** 26
**Test Coverage:** 100%
