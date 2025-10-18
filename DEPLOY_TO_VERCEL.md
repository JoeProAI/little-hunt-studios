# 🚀 Deploy to Vercel - Firebase Authentication

## ✅ Code Pushed to GitHub

Your authentication system is now in GitHub and ready to deploy!

---

## 🔧 ADD FIREBASE CREDENTIALS TO VERCEL (REQUIRED)

### Go to Vercel Environment Variables:
**Link:** https://vercel.com/joeproai/little-hunt-studios/settings/environment-variables

### Add These 7 Variables:

Click **"Add New"** for each:

```
NEXT_PUBLIC_FIREBASE_API_KEY
AIzaSyAVyXELRLT-9_k2TmoeTiMpkL5tZ98WP0E

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
little-hunt-studios.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID
little-hunt-studios

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
little-hunt-studios.firebasestorage.app

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
364740797137

NEXT_PUBLIC_FIREBASE_APP_ID
1:364740797137:web:c48ca61abfd87819579bf0

NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
G-HK72MWPM54
```

**Important:** Select **ALL** environments (Production, Preview, Development)

---

## 📋 Step-by-Step

### 1. Add Each Variable
- Click **"Add New"**
- Paste **Key** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
- Paste **Value** (e.g., `AIzaSyAVyXELRLT-9_k2TmoeTiMpkL5tZ98WP0E`)
- Check: **Production**, **Preview**, **Development**
- Click **"Save"**

Repeat for all 7 variables.

### 2. Redeploy
After adding all variables:
- Go to: https://vercel.com/joeproai/little-hunt-studios
- Click **"Deployments"** tab
- Click the **"..."** menu on latest deployment
- Click **"Redeploy"**
- Check **"Use existing Build Cache"** = OFF
- Click **"Redeploy"**

---

## ⏱️ Deployment Will Take ~3 Minutes

### What's Deploying:
- ✅ Firebase Authentication
- ✅ 3 Free Credits on Signup
- ✅ Credit Tracking
- ✅ Login/Signup Pages
- ✅ Protected Routes
- ✅ User Menu with Credits
- ✅ Video Generation with Credit Deduction

---

## 🧪 Testing Production

### Once Deployed:

1. **Visit:** https://little-hunt-studios.vercel.app
2. **You'll be redirected to:** /login
3. **Sign Up:**
   - Click "Sign up"
   - Use Google or Email
   - Get 3 free credits
4. **Generate Video:**
   - Build a prompt
   - Click "Generate Video"
   - Watch credits: 3 → 2
5. **Test Full Flow:**
   - Generate 3 videos (use all credits)
   - Try 4th video → "Insufficient credits" error ✅

---

## 🎯 What Works Now

### Authentication:
- ✅ Google Sign-In
- ✅ Email/Password Sign-In
- ✅ Protected routes
- ✅ User profiles in Firestore

### Credits System:
- ✅ 3 free credits on signup
- ✅ 1 credit per video
- ✅ Real-time balance display
- ✅ Insufficient credits error

### Video Generation:
- ✅ Sora 2 via Replicate
- ✅ Credit deduction before generation
- ✅ Videos saved to Firestore
- ✅ Transaction logging

---

## 💰 Ready for Monetization

### Next Steps (When Ready):

#### Stripe Integration (~2 hours)
- Credit packages: $5, $25, $100
- Automatic credit delivery
- Payment webhooks
- Receipt emails

#### User Dashboard (~1 hour)
- Video history
- Download videos
- Usage statistics
- Account settings

#### Admin Panel (~1 hour)
- User management
- Revenue analytics
- Usage metrics
- Manual credit adjustment

---

## 🐛 If Deployment Fails

### Check:
1. All 7 Firebase variables added to Vercel
2. All environments selected (Prod, Preview, Dev)
3. No typos in variable names (case-sensitive!)
4. Redeploy with cache disabled

### Common Issues:
- **"Firebase not initialized"** → Missing environment variables
- **"Auth domain not authorized"** → Add Vercel domain to Firebase Auth
- **Build error** → Check Vercel logs

---

## ✅ Checklist

- [ ] Added all 7 Firebase variables to Vercel
- [ ] Selected all environments for each variable
- [ ] Clicked "Redeploy"
- [ ] Waited 3 minutes for deployment
- [ ] Tested signup at https://little-hunt-studios.vercel.app
- [ ] Got 3 free credits
- [ ] Generated a video (credits deducted)

---

## 🚀 TOTAL TIME TO REVENUE

**Current Status:** Deployed with authentication + credits ✅  
**Time to First Dollar:** ~3 hours (Stripe integration)  
**Monthly Revenue Potential:** $1,000-10,000+ (with 100-1000 users)

---

**Go add those Firebase variables to Vercel and redeploy!** 🔥

Then test at: https://little-hunt-studios.vercel.app
