# Video Model API Verification

## Seedance Models

### bytedance/seedance-1-pro
**Status:** ✅ Verified
**Official Docs:** https://replicate.com/bytedance/seedance-1-pro

**Parameters We Send:**
```javascript
{
  prompt: string,
  duration: 5 | 10,        // Integer (5s or 10s)
  resolution: "1080p",     // String
  aspect_ratio: "16:9"     // String
}
```

**Supported:**
- Duration: 5 or 10 seconds
- Resolution: 480p or 1080p (we use 1080p for pro)
- Aspect ratios: 16:9, 9:16, 1:1

### bytedance/seedance-1-lite
**Status:** ✅ Verified
**Parameters We Send:**
```javascript
{
  prompt: string,
  duration: 5 | 10,        // Integer (5s or 10s)
  resolution: "720p",      // String (lower res for lite)
  aspect_ratio: "16:9"     // String
}
```

---

## All Model Status Summary

### Working Models (26 total):

1. **OpenAI Sora-2 & Sora-2 Pro** ✅
   - Duration: string ("5s")
   - Aspect ratio: "landscape" or "portrait"

2. **Google Veo (all 4 variants)** ✅
   - Duration: integer (4, 6, or 8)
   - Aspect ratio: string ("16:9", "9:16", "1:1")
   - Generate audio: boolean (true)

3. **Pixverse (v4, v4.5, v5)** ✅
   - Duration: integer (5 or 8)
   - Resolution: "1080p"
   - Aspect ratio: string ("16:9")

4. **MiniMax Hailuo-02 & Fast** ✅
   - Duration: integer (6 or 10)
   - Quality: "pro" or "standard"
   - Aspect ratio: string ("16:9")

5. **ByteDance Seedance (Pro & Lite)** ✅
   - Duration: integer (5 or 10)
   - Resolution: "1080p" (pro) or "720p" (lite)
   - Aspect ratio: string ("16:9")

6. **Kling (all 5 variants)** ✅
   - Duration: integer (5 or 10)
   - Aspect ratio: string ("16:9", "9:16", "1:1")

7. **MiniMax Video-01 & Director** ✅
   - Num frames: integer (150 or 300)
   - Aspect ratio: string ("16:9")

8. **Wan 2.5 (T2V & Fast)** ✅
   - Duration: string ("5s")
   - Aspect ratio: string ("16:9")

9. **Luma Ray Flash (720p, 540p)** ✅
   - Duration: integer (5 or 9)

10. **Luma Ray-2** ✅
    - Duration: integer (5 or 9)

11. **Luma Ray (Dream Machine)** ✅
    - Duration: string ("5s")
    - Aspect ratio: string ("16:9")

12. **Genmo Mochi-1** ✅
    - Num frames: integer (84 or 163)
    - Aspect ratio: string ("16:9")

---

## Testing Checklist

- [x] Sora-2 models
- [x] Veo models
- [x] Pixverse models
- [x] Hailuo models
- [x] Seedance models ✅ Verified with official docs
- [x] Kling models
- [x] MiniMax Video-01
- [x] Wan 2.5 models
- [x] Luma Ray models (all variants)
- [x] Mochi model

## Common Issues Fixed

1. **Duration Type Mismatches:**
   - Veo, Pixverse, Hailuo, Seedance, Kling, Luma Flash/Ray-2: Must be INTEGER
   - Sora, Wan, Luma Dream Machine: Must be STRING
   - MiniMax, Mochi: Use num_frames INTEGER

2. **Aspect Ratio:**
   - Sora: "landscape" or "portrait" (NOT 16:9)
   - Kling: "1:1", "16:9", or "9:16" (exact strings)
   - Others: "16:9" format

3. **Resolution:**
   - Seedance Pro: "1080p"
   - Seedance Lite: "720p"
   - Pixverse: "1080p"
   - Hailuo: quality parameter instead

---

**Last Updated:** 2025-10-20
**All 26 Models Status:** ✅ Working
