# Update VideoGenerationInterface.tsx

## Add these imports at the top (after line 2):

```typescript
import { useAuth } from '@/context/AuthContext';
```

## Inside the component function (after line 29):

Add this line:
```typescript
  const { user, userData, refreshUserData } = useAuth();
```

## Update the fetch call (replace lines 49-53):

```typescript
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          duration,
          userId: user?.uid  // ADD THIS LINE
        }),
      });
```

## After successful generation (add after line 93, inside the success block):

```typescript
          // Refresh user data to update credits display
          await refreshUserData();
```

---

**Just these 3 small changes needed!**

Or I can create the full updated file - reply with "create full file" if you want me to do that instead.
