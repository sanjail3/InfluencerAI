'use server'

export async function updatePricingPeriod(isAnnual: boolean) {
    try {
        // Add your server-side logic here
        // For example, you might want to:
        // - Update user preferences in the database
        // - Recalculate prices
        // - Return updated pricing data
        return { success: true, isAnnual };
    } catch (error) {
        return { success: false, error: 'Failed to update pricing period' };
    }
}