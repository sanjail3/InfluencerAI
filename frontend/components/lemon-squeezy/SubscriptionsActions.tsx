import { getSubscriptionURLs } from '@/lib/lemon-squeezy/actions';
import { UserSubscription } from '@prisma/client';

import { SubscriptionsActionsDropdown } from './SubscriptionsActionsDropdown';

// RSC that passes the appropiate urls to the SubscriptionsActionsDropdown component based on the userSubscription status
export async function SubscriptionActions({
    userSubscription,
}: {
    userSubscription: UserSubscription;
}) {
    if (
        userSubscription.status === 'expired' ||
        userSubscription.status === 'cancelled' ||
        userSubscription.status === 'unpaid'
    ) {
        return null;
    }

    // Get the appropiate urls based on the userSubscription status
    const urls = await getSubscriptionURLs(userSubscription.lemonSqueezyId);

    return (
        <SubscriptionsActionsDropdown
            userSubscription={userSubscription}
            urls={urls}
        />
    );
}
