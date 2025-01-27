'use client';

import React, { useState } from 'react';
import { formatPrice } from '@/lib/lemon-squeezy/utils';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SubscriptionPlan, UserSubscription } from '@prisma/client';
import { Check, X, Zap, Star, Rocket } from 'lucide-react';
import { CheckoutButton } from './CheckoutButton';





const PLAN_DATA = {
    starter: {
        emoji: '🚀',
        description: "Perfect for individuals and small projects",
        features: [
            "1,000 monthly credits",
            "Basic analytics",
            "Email support",
            "API access"
        ],
        missingFeatures: ["Advanced features", "Priority support", "Custom integrations"],
        mostPopular: false,
    },
    pro: {
        emoji: '⭐',
        description: "Ideal for growing teams and businesses",
        features: [
            "10,000 monthly credits",
            "Advanced analytics",
            "Priority support",
            "Custom integrations",
            "Team collaboration",
            "API access"
        ],
        missingFeatures: [],
        mostPopular: true,
    }
};

export function PlanCard({
    subscriptionPlan,
    currentPlan,
    isChangingPlans,
    isAnnual = false
}: {
    subscriptionPlan: SubscriptionPlan;
    currentPlan?: UserSubscription;
    isChangingPlans?: boolean;
    isAnnual?: boolean;
}) {
    const { productName, name, price } = subscriptionPlan;

    
    // Convert plan name to lowercase for matching with PLAN_DATA
    const planKey = name.toLowerCase() as keyof typeof PLAN_DATA;
    const item = PLAN_DATA[planKey] || {
        emoji: '📦',
        description: "Basic plan",
        features: [],
        missingFeatures: [],
        mostPopular: false
    };

    const monthlyPrice = isAnnual ? Number(price) * 0.1 : Number(price);

    return (
        <Card className={cn(
            'flex flex-col transform transition-all duration-300 hover:scale-105',
            item.mostPopular && 'border-primary border-2 shadow-lg'
        )}>
            <CardHeader className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <CardTitle className="text-xl">
                            {productName} {name}
                        </CardTitle>
                    </div>
                    {item.mostPopular && (
                        <Badge variant="default" className="bg-primary">
                            Most popular
                        </Badge>
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                        {formatPrice(monthlyPrice.toString())}
                        </span>
                        <span className="text-muted-foreground">
                            /month
                        </span>
                    </div>
                    {isAnnual && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Save 10% annually
                        </Badge>
                    )}
                </div>
                <CardDescription className="text-sm">
                    {item.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Zap className="h-4 w-4 text-primary" />
                        Credits per month
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {planKey === 'starter' ? '1,000' : '10,000'}
                    </div>
                </div>
                <div className="space-y-3">
                    {item.features.map((feature) => (
                        <div className="flex items-center gap-2" key={feature}>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                    {item.missingFeatures?.map((feature) => (
                        <div className="flex items-center gap-2 text-muted-foreground" key={feature}>
                            <X className="h-4 w-4" />
                            <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <CheckoutButton
                    plan={subscriptionPlan}
                    currentPlan={currentPlan}
                    isChangingPlans={isChangingPlans}
                    className="w-full"
                />
            </CardFooter>
        </Card>
    );
}


export default PlanCard;