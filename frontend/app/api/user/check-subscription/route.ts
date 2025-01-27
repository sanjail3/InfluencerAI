import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { subscription: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (user.credits < 5) {
            return NextResponse.json(
                { 
                    error: 'Insufficient credits - You need at least 5 credits to generate a video',
                    errorType: 'INSUFFICIENT_CREDITS'
                },
                { status: 402 }
            );
        }

        // Check for active subscription
        const hasActiveSubscription = user.subscription?.status === 'active';


        
        // If no active subscription, check credits
        if (!hasActiveSubscription) {
        
            
            return NextResponse.json(
                { 
                    error: 'No active subscription - Please upgrade your plan',
                    errorType: 'NO_SUBSCRIPTION'
                },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Subscription check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}