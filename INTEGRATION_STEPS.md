# 🔥 Final Integration Steps

## ✅ Files Already Created
- ✅ `src/lib/firebase.ts` - Firebase SDK
- ✅ `src/context/AuthContext.tsx` - Auth system
- ✅ `src/lib/credits.ts` - Credit management
- ✅ `src/components/Providers.tsx` - Client-side provider wrapper
- ✅ `src/components/UserMenu.tsx` - User menu with credits display
- ✅ `src/app/login/page.tsx` - Login page
- ✅ `src/app/signup/page.tsx` - Signup page
- ✅ `.env.local` - Firebase credentials

## 🔧 Files That Need Updates

### 1. Update `src/app/layout.tsx`

Replace the entire file with:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Little Hunt Studios',
  description: 'Professional video generation platform powered by Sora 2 and GPT Image 1',
  keywords: ['Little Hunt Studios', 'Sora 2', 'AI Video', 'Video Generation', 'GPT Image', 'Cinematic'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

### 2. Update `src/app/page.tsx`

Add these imports at the top (around line 10):

```typescript
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
```

Inside the Home component, add after the state declarations (around line 21):

```typescript
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;
```

Replace the header buttons section (lines 67-74) with:

```typescript
            <UserMenu />
```

---

### 3. Update `src/app/api/replicate/generate/route.ts`

Add at the top:

```typescript
import { deductCredits, hasEnoughCredits } from '@/lib/credits';
import { doc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
```

Replace the entire POST function with:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration = '5s', aspect_ratio = '16:9', model, userId } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase more credits to continue.' },
        { status: 402 }
      );
    }

    // Deduct credits BEFORE generation
    await deductCredits(userId, 1);

    // Call Replicate API
    const result = await generateVideoWithReplicate({
      prompt,
      duration,
      aspect_ratio,
      model,
    });

    // Save video to Firestore
    await addDoc(collection(db, 'videos'), {
      userId,
      prompt,
      videoUrl: result.video_url || null,
      status: result.status,
      duration,
      aspectRatio: aspect_ratio,
      model: model || 'openai/sora-2',
      creditsCost: 1,
      createdAt: new Date(),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Replicate generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
```

---

### 4. Update `src/components/VideoGenerationInterface.tsx`

Add at the top:

```typescript
import { useAuth } from '@/context/AuthContext';
```

Inside the component, add after the state declarations:

```typescript
  const { user } = useAuth();
```

Update the generateVideo function to include userId (around line 49):

```typescript
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          duration,
          userId: user?.uid  // Add this line
        }),
      });
```

---

## 🚀 Quick Apply Script

I'll create these files for you! Ready?

**Reply with:** "Apply changes"

And I'll:
1. Create backup files
2. Apply all updates
3. Commit to git
4. Start dev server for testing

---

## 🧪 After Changes - Testing

1. Start dev server: `npm run dev`
2. Visit http://localhost:3000
3. You'll be redirected to /login
4. Sign up with Google or Email
5. Get 3 free credits automatically
6. Generate a video (1 credit deducted)
7. See remaining credits in header

---

## 💰 Ready for Monetization

Once working, we'll add:
- ✅ Stripe integration (15 min)
- ✅ Credit packages ($5/$25/$100)
- ✅ User dashboard with video history
- ✅ Admin analytics

**Total monetization setup: ~30 min after testing!** 🚀
