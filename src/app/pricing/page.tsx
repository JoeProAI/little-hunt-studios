'use client';

export const dynamic = 'force-dynamic';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { SUBSCRIPTION_TIERS, calculateTierValue } from '@/lib/model-pricing';

export default function PricingPage() {
  const { user, userData } = useAuth();
  const router = useRouter();

  const handleSelectTier = (tierId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (tierId === 'free') {
      // Already on free tier
      router.push('/');
      return;
    }

    // TODO: Integrate with Stripe or payment processor
    alert(`Upgrade to ${tierId.toUpperCase()} tier coming soon! This will integrate with Stripe.`);
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'free': return <Sparkles className="w-8 h-8" />;
      case 'pro': return <Zap className="w-8 h-8" />;
      case 'studio': return <Crown className="w-8 h-8" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Flexible pricing for creators of all levels
          </p>
          <p className="text-sm text-muted-foreground">
            Mix and match models based on your needs • Cancel anytime
          </p>
        </div>

        {/* Current Plan Alert */}
        {userData && (
          <div className="mb-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
            <p className="text-sm">
              Current Plan: <span className="font-bold text-purple-400">{userData.subscriptionTier.toUpperCase()}</span>
              {' • '}
              Credits Remaining: <span className="font-bold text-green-400">{userData.credits}</span>
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
            const value = calculateTierValue(tier);
            const isCurrentPlan = userData?.subscriptionTier === tier.id;

            return (
              <Card
                key={tier.id}
                className={`relative ${
                  tier.recommended
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-105'
                    : 'border-slate-800'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-6">
                  <div className="flex justify-center mb-4 text-purple-400">
                    {getTierIcon(tier.id)}
                  </div>
                  <CardTitle className="text-3xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">${tier.price}</span>
                    {tier.price > 0 && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <CardDescription className="mt-2">
                    {tier.monthlyCredits} credits per month
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Usage Examples */}
                  <div className="bg-slate-900/50 rounded-lg p-4 mb-6 text-sm">
                    <p className="font-semibold mb-2 text-purple-400">What you can create:</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• {value.premiumVideos} premium videos</li>
                      <li>• {value.midRangeVideos} mid-range videos</li>
                      <li>• {value.budgetVideos} budget videos</li>
                    </ul>
                    {tier.price > 0 && (
                      <p className="mt-2 text-xs text-green-400">
                        ${value.pricePerCredit.toFixed(2)} per credit
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleSelectTier(tier.id)}
                    className="w-full"
                    variant={tier.recommended ? 'default' : isCurrentPlan ? 'outline' : 'secondary'}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : tier.price === 0 ? 'Get Started' : `Upgrade to ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Credit Tiers Explanation */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle>Model Pricing Tiers</CardTitle>
            <CardDescription>Different models cost different amounts of credits based on their quality and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-500">Premium</Badge>
                  <span className="text-sm font-semibold">3 Credits</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Highest quality models with advanced features like synced audio, 4K resolution, and maximum prompt adherence
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Sora-2 Pro & Sora-2</li>
                  <li>• Google Veo-3.1</li>
                  <li>• Professional use cases</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Mid-Range</Badge>
                  <span className="text-sm font-semibold">2 Credits</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Production-quality models perfect for content creation, marketing, and most professional needs
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Pixverse, Hailuo, Seedance Pro</li>
                  <li>• Kling 2.x, MiniMax, Wan 2.5</li>
                  <li>• 1080p quality, balanced speed</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Budget</Badge>
                  <span className="text-sm font-semibold">1 Credit</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Fast and affordable models ideal for rapid iteration, drafts, and testing ideas
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Luma Ray Flash, Kling 1.6</li>
                  <li>• Seedance Lite, Hailuo Fast</li>
                  <li>• 540p-720p, fastest speed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Can I mix model tiers?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Use your credits on any combination of models. Generate 10 premium videos, or 30 mid-range, or 60 budget - it&apos;s up to you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens to unused credits?</h3>
              <p className="text-sm text-muted-foreground">
                Credits roll over month-to-month as long as you maintain an active subscription. Free tier credits reset monthly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely. No contracts, no commitments. Cancel anytime and keep your remaining credits until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Need more credits?</h3>
              <p className="text-sm text-muted-foreground">
                You can purchase additional credit packs anytime. Heavy users should consider the Studio plan for the best value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
