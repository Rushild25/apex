import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        exercises: {
          include: { sets: true }
        }
      }
    });

    const routines = await prisma.routine.findMany({
      where: { userId },
      include: {
        exercises: {
          include: { sets: true }
        }
      }
    });

    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    const data = { profile, workouts, routines };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
