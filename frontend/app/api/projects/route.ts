// app/api/projects/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';




export async function GET(req: Request) {
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

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id
      },
      include: {
        videos: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('[PROJECTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // First, get the user from the database using their clerkId
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Now create the project using the internal userId
    const project = await prisma.project.create({
      data: {
        name,
        userId: user.id, // Use the internal user.id instead of clerkId
        websiteUrl: '',
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('[PROJECTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}