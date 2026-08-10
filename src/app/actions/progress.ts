"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addProgressEntry(weight: number, notes: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const date = new Date();
  date.setHours(0,0,0,0);

  await prisma.progressEntry.upsert({
    where: {
      userId_date: { userId, date }
    },
    update: {
      bodyWeight: weight,
      notes: notes || null,
    },
    create: {
      userId,
      date,
      bodyWeight: weight,
      notes: notes || null,
    }
  });

  revalidatePath("/progress");
}

