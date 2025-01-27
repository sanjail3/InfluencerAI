import { UserSubscription } from '@prisma/client';

export function formatPrice(priceInCents: string) {
    const price = parseFloat(priceInCents);
    return price/100;
}


export function isValidSubscription(status: UserSubscription['status']) {
    return (
        status !== 'cancelled' && status !== 'expired' && status !== 'unpaid'
    );
}
