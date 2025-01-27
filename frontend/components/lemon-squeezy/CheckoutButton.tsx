'use client';

import { changePlan, getCheckoutURL } from '@/lib/lemon-squeezy/actions';
import { Button } from '@/components/ui/button';
import { SignInButton, useSession } from '@clerk/nextjs';
import { SubscriptionPlan, UserSubscription } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { type ComponentProps, type ElementRef, forwardRef, useState } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';


// interface PricingPlan {
//     id: string; // Add this property
//     name: string;
//     price: string;
//     yearlyPrice: string;
//     period: string;
//     features: string[];
//     description: string | null; // Adjust if necessary
//     buttonText: string;
//     href: string;
//     isPopular: boolean;
//     variantId: number;
//     isUsageBased: boolean; // Add this property
//     createdAt: Date; // Add this property
//     updatedAt: Date; // Add this property
//     // Add any other missing properties as needed
// }

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button> & {
    embed?: boolean;
    currentPlan?: UserSubscription;
    plan: any;
    isChangingPlans?: boolean;
    buttonname?: string;
    isPopular?: boolean;
};

export const CheckoutButton = forwardRef<ButtonElement, ButtonProps>(
    (props, ref) => {
        const router = useRouter();
        const session = useSession();
        const {
            embed = false,
            plan,
            currentPlan,
            isChangingPlans,
            buttonname,
            isPopular,
            className,
            ...otherProps
        } = props;

        const [loading, setLoading] = useState(false);
        const isCurrent = plan.id === currentPlan?.planId;

        const buttonClasses = cn(
            "w-full py-6 text-lg font-semibold",
            isPopular
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                : "bg-gray-800/50 text-gray-200 border-gray-700 hover:bg-gray-700/50",
            className
        );

        if (!session?.isSignedIn) {
            return (
                <SignInButton>
                    <Button
                        ref={ref}
                        disabled={loading || isCurrent || props.disabled}
                        className={buttonClasses}
                        {...otherProps}
                    >
                        Sign up {isPopular ? "⚡" : "→"}
                    </Button>
                </SignInButton>
            );
        }

        return (
            <Button
                ref={ref}
                disabled={loading || props.disabled}
                className={buttonClasses}
                onClick={async () => {
                    if (isChangingPlans) {
                        if (!currentPlan?.id) {
                            throw new Error('Current plan not found.');
                        }

                        if (!plan.id) {
                            throw new Error('New plan not found.');
                        }

                        setLoading(true);
                        await changePlan(currentPlan.planId, plan.id);
                        setLoading(false);

                        router.refresh();
                        return;
                    }

                    let checkoutUrl: string | undefined = '';
                    try {
                        setLoading(true);
                        console.log(plan.variantId, embed);
                        checkoutUrl = await getCheckoutURL(plan.variantId, embed);
                    } catch (error) {
                        setLoading(false);
                        toast.error("CheckoutError");
                    } finally {
                        embed && setLoading(false);
                    }

                    embed
                        ? checkoutUrl && window.LemonSqueezy.Url.Open(checkoutUrl)
                        : router.push(checkoutUrl ?? '/');
                }}
                {...otherProps}
            >
                {buttonname} {isPopular ? "⚡" : "→"}
            </Button>
        );
    }
);

CheckoutButton.displayName = 'CheckoutButton';