// app/api/user/credits/route.ts
import {auth} from '@clerk/nextjs/server'
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const {userId: clerkId} = await auth()

    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }


    const userData = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasSubscription = userData.subscription?.status === 'active';

    console.log(hasSubscription);

    return NextResponse.json({
      current: userData.credits,
      max: userData.maxCredits,
      hasSubscription,
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}