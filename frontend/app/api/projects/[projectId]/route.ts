// app/api/projects/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: any
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projectId = params.projectId;
    const body = await req.json();
    const { websiteUrl, metadata } = body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Update project
    const project = await prisma.project.update({
      where: {
        id: projectId,
        userId: user.id, // Ensure the project belongs to the user
      },
      data: {
        websiteUrl,
        metadata,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('[PROJECTS_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
type RouteParams = Promise<{ projectId: string }>;

export async function DELETE(
    req: Request,
    { params }: any,
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

      if(!params.projectId) {
        return new NextResponse('Project not found', { status: 404 });
      }
  
      // Delete project and associated videos
      await prisma.project.delete({
        where: {
          id: params.projectId,
          userId: user.id
        }
      });
  
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error('[PROJECT_DELETE]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }