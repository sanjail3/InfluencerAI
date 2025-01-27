'use client';


import { Button } from '@/components/ui/button';
import { SubscriptionPlan, UserSubscription } from '@prisma/client';
import { useState } from 'react';

import { ChangePlans } from './ChangePlans';

// Renders the change plans button and opens a modal to change plans
export function ChangePlansButton({
    allPlans,
    userSubscriptions,
}: {
    allPlans: SubscriptionPlan[];
    userSubscriptions: UserSubscription[];
}) {
    

    const [isChangePlansOpen, setIsChangePlansOpen] = useState(false);

    return (
        <>
            {isChangePlansOpen && (
                <ChangePlans
                    allPlans={allPlans}
                    userSubscriptions={userSubscriptions}
                    onClose={() => setIsChangePlansOpen(false)}
                />
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangePlansOpen(true)}
            >
                Change Plan
            </Button>
        </>
    );
}
