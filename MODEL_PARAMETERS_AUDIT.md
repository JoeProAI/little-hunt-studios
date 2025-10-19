# Video Model Parameters Audit

## Models and Their Required Parameters

### 1. OpenAI Sora-2 / Sora-2 Pro
- `prompt`: string (text description)
- `duration`: string ("5s")
- `aspect_ratio`: "landscape" or "portrait" (converted from 16:9/9:16)
- `openai_api_key`: string (required env var)

### 2. Google Veo-3, Veo-3 Fast, Veo-3.1, Veo-3.1 Fast
- `prompt`: string
- `duration`: integer (4, 6, or 8)
- `aspect_ratio`: string ("16:9", "9:16", "1:1")
- `generate_audio`: boolean (true)

### 3. Pixverse v4, v4.5, v5
- `prompt`: string
- `duration`: integer (5 or 8)
- `resolution`: string ("1080p", "720p", "540p")
- `aspect_ratio`: string ("16:9", "9:16", "1:1")

### 4. MiniMax Hailuo-02, Hailuo-02-fast
- `prompt`: string
- `duration`: integer (6 or 10)
- `quality`: string ("pro" or "standard")
- `aspect_ratio`: string ("16:9", "9:16", "1:1")

### 5. ByteDance Seedance-1-Pro, Seedance-1-Lite
- `prompt`: string
- `duration`: integer (5 or 10)
- `resolution`: string ("1080p" or "720p")
- `aspect_ratio`: string ("16:9", "9:16", "1:1")

### 6. Kling v1.5, v1.6, v2.0, v2.1, v2.5 (all variants)
- `prompt`: string
- `duration`: integer (5 or 10)
- `aspect_ratio`: string ("16:9", "9:16", "1:1")
- Note: Resolution determined by model name (pro/master=1080p, standard=720p)

### 7. MiniMax Video-01, Video-01-Director
- `prompt`: string
- `num_frames`: integer (150 for 5s, 300 for 10s)
- `aspect_ratio`: string ("16:9", "9:16", "1:1")

### 8. Wan 2.5 T2V, Wan 2.5 T2V Fast
- `prompt`: string
- `duration`: string ("5s")
- `aspect_ratio`: string ("16:9", "9:16", "1:1")

### 9. Luma Ray (Dream Machine)
- `prompt`: string
- `duration`: string ("5s")
- `aspect_ratio`: string ("16:9", "9:16", "1:1")

### 10. Luma Ray-Flash-2-720p, Ray-Flash-2-540p
- `prompt`: string
- `duration`: string ("5s" or "9s")
- Note: Resolution in model name

### 11. Genmo Mochi-1
- `prompt`: string
- `num_frames`: integer (84 for 5s, 163 for 10s)
- `aspect_ratio`: string ("16:9", "9:16", "1:1")

## Issues Found:
- None currently - all parameters correctly mapped
