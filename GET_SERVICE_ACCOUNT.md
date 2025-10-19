# 🔑 Get Firebase Service Account Credentials

## Error You're Seeing:
```
Could not load the default credentials.
```

This means you need to add service account credentials to Vercel.

---

## 📋 Step-by-Step Instructions

### Step 1: Generate Service Account Key

1. **Go to Firebase Console:**
   https://console.firebase.google.com/project/little-hunt-studios/settings/serviceaccounts/adminsdk

2. **Click "Generate new private key"** button

3. **Click "Generate key"** in the popup

4. **Save the JSON file** that downloads

---

### Step 2: Extract Values from JSON

Open the downloaded JSON file and find these values:

```json
{
  "type": "service_account",
  "project_id": "little-hunt-studios",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@little-hunt-studios.iam.gserviceaccount.com",
  ...
}
```

You need:
- **`client_email`** 
- **`private_key`** (entire string including BEGIN/END)

---

### Step 3: Add to Vercel

**Go to:** https://vercel.com/joeproai/little-hunt-studios/settings/environment-variables

Click **"Add New"** twice:

#### Variable 1:
**Name:** `FIREBASE_CLIENT_EMAIL`  
**Value:** (paste the `client_email` from JSON)  
Example: `firebase-adminsdk-xxxxx@little-hunt-studios.iam.gserviceaccount.com`

✅ Check: Production, Preview, Development

#### Variable 2:
**Name:** `FIREBASE_PRIVATE_KEY`  
**Value:** (paste the entire `private_key` from JSON - keep the \n characters)  
Example: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n`

✅ Check: Production, Preview, Development

---

### Step 4: Redeploy

1. Go to: https://vercel.com/joeproai/little-hunt-studios
2. Click **"Deployments"**
3. Click the latest deployment
4. Click **"Redeploy"**
5. **UNCHECK** "Use existing Build Cache"
6. Click **"Redeploy"**

---

## 📋 Copy-Paste Format

After you have the values from the JSON file, use this format:

```
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@little-hunt-studios.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n
```

Paste into Vercel's bulk add feature.

---

## ✅ After Adding

The app will:
- ✅ Initialize Firebase Admin SDK properly
- ✅ Manage credits on the server
- ✅ Save videos to Firestore
- ✅ Log transactions securely

---

## 🚨 Important Notes

- **Keep the private key secret!** Never commit it to Git
- The private key should include `\n` characters (not actual line breaks)
- Both variables must be set for the app to work
- Check ALL environments (Production, Preview, Development)

---

**Go download that service account JSON now!** 🔑
