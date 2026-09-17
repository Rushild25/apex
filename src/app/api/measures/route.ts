import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { date, weight, waist, bodyFat, neck, chest, bicep } = body;

    const parsedDate = new Date(date);

    // Upsert into ProgressEntry
    const extraNotes = JSON.stringify({ waist, neck, chest, bicep });

    const entry = await prisma.progressEntry.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: parsedDate,
        },
      },
      update: {
        bodyWeight: weight,
        bodyFat: bodyFat,
        notes: extraNotes,
      },
      create: {
        userId: session.user.id,
        date: parsedDate,
        bodyWeight: weight,
        bodyFat: bodyFat,
        notes: extraNotes,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to save progress entry:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
