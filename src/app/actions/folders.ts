"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createRoutineFolder(name: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Unauthorized" };

    if (!name || !name.trim()) {
      return { success: false, error: "Folder name is required" };
    }

    const folder = await prisma.routineFolder.create({
      data: {
        userId,
        name: name.trim(),
      },
    });

    revalidatePath("/workout");
    return { success: true, folder };
  } catch (error: any) {
    console.error("Failed to create routine folder:", error);
    return { success: false, error: error.message || "Failed to create folder" };
  }
}

export async function deleteRoutineFolder(folderId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Unauthorized" };

    await prisma.routineFolder.deleteMany({
      where: { id: folderId, userId },
    });

    revalidatePath("/workout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete routine folder:", error);
    return { success: false, error: error.message || "Failed to delete folder" };
  }
}
