'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Coins, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function UserMenu() {
  const { user, userData, signOut, refreshUserData } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserData();
    setIsRefreshing(false);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Credits Display */}
      <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <Coins className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold">{userData?.credits || 0} Credits</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-1"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh credits"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
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
