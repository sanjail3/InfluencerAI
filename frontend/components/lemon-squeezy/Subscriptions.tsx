import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Plan from '@/components/lemon-squeezy/Plan';
import { ChangePlansButton } from './ChangePlansButton';
import { SubscriptionActions } from './SubscriptionsActions';
import { formatPrice, isValidSubscription } from '@/lib/lemon-squeezy/utils';
import { formatDateShort } from '@/lib/format';
import { SubscriptionPlan, UserSubscription } from '@prisma/client';

const Subscriptions = ({ allPlans, userSubscriptions }: { allPlans: SubscriptionPlan[], userSubscriptions: UserSubscription[] }) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-2">
            ✨ Subscription Dashboard
          </h1>
          <p className="text-gray-300">Manage your plan and billing details</p>
        </div>

        <Card className="bg-black/50 border border-purple-500/30 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <CardTitle className="text-gray-100">Billing</CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              Your subscription details and plan management
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!userSubscriptions.some((s) => isValidSubscription(s.status)) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                  <span>🌟</span> Available Plans
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {allPlans.map((item, index) => (
                    <Plan key={index} subscriptionPlan={item} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {userSubscriptions.map((subscription) => {
                const plan = allPlans.find((p) => p.id === subscription.planId);
                if (!plan) return null;

                return (
                  <Card key={subscription.id} className="bg-purple-900/20 border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <CardHeader className="grid gap-2">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📊</span>
                          <CardTitle className="text-gray-100">
                            {plan?.productName} {plan?.name}
                          </CardTitle>
                          <SubscriptionStatusBadge subscription={subscription} />
                        </div>
                        <div className="flex gap-2">
                          {isValidSubscription(subscription.status) && (
                            <ChangePlansButton
                              allPlans={allPlans}
                              userSubscriptions={userSubscriptions}
                            />
                          )}
                          <SubscriptionActions userSubscription={subscription} />
                        </div>
                      </div>
                      <CardDescription>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                          <SubscriptionPriceInfo
                            subscription={subscription}
                            plan={plan}
                          />
                          <SubscriptionDateInfo subscription={subscription} />
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SubscriptionStatusBadge = ({ subscription: subscription }: { subscription: UserSubscription }) => {
  const statusStyles = {
    active: 'bg-green-500/20 text-green-300 border-green-500/30',
    cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    expired: 'bg-red-500/20 text-red-300 border-red-500/30',
    past_due: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    on_trial: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    unpaid: 'bg-red-500/20 text-red-300 border-red-500/30',
    paused: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  };

  const status = subscription?.isPaused ? 'paused' : subscription?.status;
  const label = subscription?.isPaused ? 'Paused' : subscription?.statusFormatted;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${ statusStyles.active}`}>
      {label}
    </span>
  );
};

const SubscriptionPriceInfo = ({ subscription: subscription, plan }: { subscription: UserSubscription, plan: SubscriptionPlan }) => {
  if (subscription?.endsAt) return null;

  let price = formatPrice(subscription?.price);
  // if (subscription?.isUsageBased) price += '/unit';

  const interval = plan?.intervalCount && plan?.intervalCount !== 1
    ? `every ${plan?.intervalCount} ${plan?.interval}`
    : `every ${plan?.interval}`;

  return <span className="text-gray-300">{`${price} ${interval}`}</span>;
};

const SubscriptionDateInfo = ({ subscription }: { subscription: UserSubscription }) => {
  const now = new Date();
  const trialEndDate = subscription?.trialEndsAt ? new Date(subscription?.trialEndsAt) : null;
  const endsAtDate = subscription?.endsAt ? new Date(subscription?.endsAt) : null;

  if (!subscription?.trialEndsAt && !subscription?.renewsAt) return null;

  let message;
  if (trialEndDate && trialEndDate > now) {
    message = `Ends on ${trialEndDate ? formatDateShort(trialEndDate) : 'N/A'}`;
  } else if (endsAtDate && subscription?.endsAt) {
    message = endsAtDate < now
      ? `Expired on ${endsAtDate ? formatDateShort(endsAtDate) : 'N/A'}`
      : `Expires on ${endsAtDate ? formatDateShort(endsAtDate) : 'N/A'}`;
  } else {
    message = 'No expiration date available';
  }

  return <span className="text-gray-300">{message}</span>;
};

export default Subscriptions;