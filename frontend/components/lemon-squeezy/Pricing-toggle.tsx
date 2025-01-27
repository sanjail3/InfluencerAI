'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export const PricingToggle = ({
    initialValue = false
}: {
    initialValue?: boolean;
}) => {
    const [isAnnual, setIsAnnual] = useState(initialValue);

    return (
        <div className="flex items-center gap-3 bg-secondary p-1 rounded-full">
            <span className={cn(
                "px-4 py-2 rounded-full transition-colors",
                !isAnnual && "bg-white shadow-sm"
            )}>
                Monthly
            </span>
            <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
            />
            <span className={cn(
                "px-4 py-2 rounded-full transition-colors",
                isAnnual && "bg-white shadow-sm"
            )}>
                Annual
            </span>
        </div>
    );
};