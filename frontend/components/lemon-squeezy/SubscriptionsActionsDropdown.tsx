'use client';

import {
    cancelSub,
    getSubscriptionURLs,
    pauseUserSubscription,
    unpauseUserSubscription,
} from '@/lib/lemon-squeezy/actions';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserSubscription } from '@prisma/client';
import { MoreVertical, MoveUpRight } from 'lucide-react';
import { useState } from 'react';

// Renders the subscription actions dropdown
export function SubscriptionsActionsDropdown({
    userSubscription,
    urls,
}: {
    userSubscription: UserSubscription;
    urls: Awaited<ReturnType<typeof getSubscriptionURLs>>;
}) {
    

    const [loading, setLoading] = useState(false);

    if (
        userSubscription.status === 'expired' ||
        userSubscription.status === 'cancelled' ||
        userSubscription.status === 'unpaid'
    ) {
        return null;
    }

    const isPaused = userSubscription.isPaused;

    return (
        <>
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-muted/50">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
                </div>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="w-8">
                        <MoreVertical className="h-3.5 w-3.5 shrink-0" />
                        <span className="sr-only">More</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {!isPaused && (
                        <DropdownMenuItem
                            onClick={async () => {
                                setLoading(true);
                                await pauseUserSubscription(
                                    userSubscription.lemonSqueezyId,
                                ).then(() => {
                                    setLoading(false);
                                });
                            }}
                        >
                           Pause payments
                        </DropdownMenuItem>
                    )}
                    {isPaused && (
                        <DropdownMenuItem
                            onClick={async () => {
                                setLoading(true);
                                await unpauseUserSubscription(
                                    userSubscription.lemonSqueezyId,
                                ).then(() => {
                                    setLoading(false);
                                });
                            }}
                        >
                            unpause payments
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <a href={urls?.customer_portal}>
                           customer portal
                            <MoveUpRight className="ml-1 h-4 w-4" />
                        </a>
                    </DropdownMenuItem>
                    {urls?.update_payment_method && (
                        <DropdownMenuItem
                            onClick={() => {
                                window.LemonSqueezy?.Url?.Open(
                                    urls?.update_payment_method,
                                );
                            }}
                        >
                            update payment method
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-400"
                        onClick={async () => {
                            if (
                                confirm(
                                    "cancel_subscription_confirm'"
                                )
                            ) {
                                setLoading(true);
                                await cancelSub(
                                    userSubscription.lemonSqueezyId,
                                ).then(() => {
                                    setLoading(false);
                                });
                            }
                        }}
                    >
                        cancel_subscription_confirm'
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
