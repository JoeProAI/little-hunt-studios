import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use GPT to intelligently parse the text into structured fields
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert video prompt analyzer. Parse the user's video description into these specific fields:

- scene: The LOCATION/SETTING only (e.g., "a misty forest at dawn", "inside a Jack o'lantern")
- subject: The MAIN SUBJECT/CHARACTER only (e.g., "a person", "a car", "candlelight") - just the noun, not the action
- action: What the subject is DOING (e.g., "walking slowly", "playing instruments", "flickering")
- camera: The CAMERA MOVEMENT/ANGLE (e.g., "low angle orbit shot", "aerial drone view", "dolly in")
- look: VISUAL STYLE/LIGHTING (e.g., "cinematic lighting", "candle light", "golden hour", "dramatic color grading")
- audio: SOUND/MUSIC descriptions (e.g., "ambient music", "jazz instruments", "quiet atmosphere")

Rules:
1. Keep each field SHORT and SPECIFIC
2. Subject should be JUST the subject (e.g., "a musician" not "a musician playing guitar")
3. Put the action in the ACTION field (e.g., "playing guitar")
4. If something relates to sound/music, put it in AUDIO
5. Only fill fields that have clear information
6. Return valid JSON only

Return ONLY a JSON object like:
{"scene": "...", "subject": "...", "action": "...", "camera": "...", "look": "...", "audio": "..."}

If a field has no information, set it to empty string "".`
        },
        {
          role: 'user',
          content: `Parse this video description:\n\n${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);

    return NextResponse.json({
      success: true,
      fields: parsed
    });
  } catch (error: any) {
    console.error('Parse prompt error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse prompt' },
      { status: 500 }
    );
  }
}
