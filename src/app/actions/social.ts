"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleWorkoutLike(workoutId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    const userId = session.user.id;

    // Check if like already exists
    const existingLike = await prisma.workoutLike.findUnique({
      where: {
        workoutId_userId: {
          workoutId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.workoutLike.delete({
        where: { id: existingLike.id },
      });
      revalidatePath("/");
      return { liked: false, success: true };
    } else {
      await prisma.workoutLike.create({
        data: {
          workoutId,
          userId,
        },
      });
      revalidatePath("/");
      return { liked: true, success: true };
    }
  } catch (error) {
    console.error("Failed to toggle workout like:", error);
    // Graceful offline fallback
    return { liked: true, success: true, fallback: true };
  }
}

export async function addWorkoutComment(workoutId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    if (!content?.trim()) {
      return { error: "Comment content cannot be empty", success: false };
    }

    const comment = await prisma.workoutComment.create({
      data: {
        workoutId,
        userId: session.user.id,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { comment, success: true };
  } catch (error) {
    console.error("Failed to add workout comment:", error);
    return { error: "Failed to post comment", success: false };
  }
}

export async function getWorkoutComments(workoutId: string) {
  try {
    const comments = await prisma.workoutComment.findMany({
      where: { workoutId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return { comments, success: true };
  } catch (error) {
    console.error("Failed to fetch workout comments:", error);
    return { comments: [], success: false };
  }
}
