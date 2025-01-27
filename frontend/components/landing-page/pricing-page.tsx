import { prisma } from '@/lib/db';
import { SubscriptionPlan } from '@prisma/client';
import { PricingToggle } from '../lemon-squeezy/Pricing-toggle';
import { PlanCard } from '../lemon-squeezy/Plan';
import { useState } from 'react';

export async function LandingPagePricing() {
    // Get all plans from the database.
    const allPlans: SubscriptionPlan[] = await prisma.subscriptionPlan.findMany();

    if (!allPlans.length) {
        return <p>No plans available.</p>;
    }

    return (
        <div id="landing-pricing" className="w-full max-w-6xl mx-auto flex flex-col items-center p-8 gap-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold relative">
                    <span className="relative z-10">Simple, transparent pricing</span>
                    <img
                        src="/images/brix/Circle 4.svg"
                        alt="Image"
                        className="h-24 max-w-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
                    />
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Choose the perfect plan for your needs. All plans include full access to our core features.
                </p>
            </div>

            <PricingToggle initialValue={false} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
                {allPlans.map((item, index) => (
                    <PlanCard
                        key={index}
                        subscriptionPlan={item}
                        isAnnual={false}
                    />
                ))}
            </div>
        </div>
    );
}