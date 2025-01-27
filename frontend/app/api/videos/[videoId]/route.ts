import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function DELETE(
    req: Request,
    { params }: any
  ) {
    try {
      const { userId: clerkId } = await auth();
      if (!clerkId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const user = await prisma.user.findUnique({
        where: { clerkId }
      });
  
      if (!user) {
        return new NextResponse('User not found', { status: 404 });
      }
  
      // Delete video
      await prisma.video.delete({
        where: {
          id: params.videoId,
          userId: user.id
        }
      });
  
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error('[VIDEO_DELETE]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }