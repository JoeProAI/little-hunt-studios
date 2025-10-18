'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, userData, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/login')}>
          Sign In
        </Button>
        <Button onClick={() => router.push('/signup')}>
          Sign Up - Get 3 Free Credits
        </Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Credits Display */}
      <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <Coins className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold">{userData?.credits || 0} Credits</span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">{userData?.displayName || 'User'}</p>
          <p className="text-xs text-muted-foreground">{userData?.subscriptionTier || 'free'}</p>
        </div>
        <Button variant="outline" size="icon" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
