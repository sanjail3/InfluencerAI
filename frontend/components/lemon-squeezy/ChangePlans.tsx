'use client';

import  Plan  from '@/components/lemon-squeezy/Plan';
import { isValidSubscription } from '@/lib/lemon-squeezy/utils';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { SubscriptionPlan, UserSubscription } from '@prisma/client';

export function ChangePlans({
    allPlans,
    userSubscriptions,
    onClose,
}: {
    allPlans: SubscriptionPlan[];
    userSubscriptions: UserSubscription[];
    onClose: () => void;
}) {
   

    const currentPlan = userSubscriptions.find((s) =>
        isValidSubscription(s.status),
    );

    // Check if the current plan is usage based
    const isCurrentPlanUsageBased = currentPlan?.isUsageBased;

    // Get all plans that are usage based or not usage based
    const filteredPlans = allPlans
        .filter((plan) => {
            return isCurrentPlanUsageBased
                ? Boolean(plan.isUsageBased)
                : Boolean(!plan.isUsageBased);
        })
        .sort((a, b) => {
            if (
                a.sort === undefined ||
                a.sort === null ||
                b.sort === undefined ||
                b.sort === null
            ) {
                return 0;
            }

            return a.sort - b.sort;
        });

    return (
        <Sheet
            open
            onOpenChange={(isOpen: any) => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <SheetContent
                className="overflow-y-auto w-full h-full md:h-auto"
                side="bottom"
            >
                <SheetHeader>
                    <SheetTitle>
                        change plan
                    </SheetTitle>
                    <SheetDescription>
                        This is the change plan page.
                    </SheetDescription>
                </SheetHeader>

                {!userSubscriptions.length ||
                !allPlans.length ||
                filteredPlans.length < 2 ? (
                    <p>plans available</p>
                ) : (
                    <div className="grid md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 py-4">
                        {filteredPlans.map((plan, index) => (
                            <Plan
                                key={plan.id}
                                subscriptionPlan={plan}
                                currentPlan={currentPlan}
                                isChangingPlans={true}
                            />
                        ))}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
