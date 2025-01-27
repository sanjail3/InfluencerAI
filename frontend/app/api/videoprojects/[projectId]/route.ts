// app/api/videos/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';


// app/api/videos/[projectId]/route.ts
export async function GET(
  req: Request,
  { params }: any
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projectId = params.projectId;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    console.log(user);

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get all videos for the project
    const videos = await prisma.video.findMany({
      where: {
        projectId,
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('[VIDEOS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}