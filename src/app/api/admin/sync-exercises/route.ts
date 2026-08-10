import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { exerciseDbItemSchema } from "@/lib/validations/exercise";
import { z } from "zod";

const EXERCISE_DB_URL = "https://oss.exercisedb.dev/api/v1/exercises?limit=1500";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body.secret !== env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const syncLog = await prisma.exerciseSyncLog.create({
      data: { status: "RUNNING" },
    });

    try {
      const response = await fetch(EXERCISE_DB_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ExerciseDB: ${response.statusText}`);
      }

      const data = await response.json();
      const exercises = z.array(exerciseDbItemSchema).parse(data);

      let added = 0;
      let updated = 0;

      // Upsert exercises
      // Using transaction or sequential upsert
      // Sequential upsert to avoid huge transaction memory spikes
      for (const ex of exercises) {
        const existing = await prisma.exercise.findUnique({
          where: { externalId: ex.id },
        });

        const exData = {
          source: "SYSTEM" as const,
          name: ex.name,
          normalizedName: ex.name.toLowerCase(),
          instructions: ex.instructions,
          category: ex.target, // using target as category approximation
          bodyPart: ex.bodyPart,
          target: ex.target,
          secondaryMuscles: ex.secondaryMuscles,
          equipment: ex.equipment,
          gifUrl: ex.gifUrl,
          imageUrls: [], // V1 doesn't have static images, only gifs
          isArchived: false,
          lastSyncedAt: new Date(),
        };

        if (existing) {
          await prisma.exercise.update({
            where: { id: existing.id },
            data: exData,
          });
          updated++;
        } else {
          await prisma.exercise.create({
            data: {
              ...exData,
              externalId: ex.id,
            },
          });
          added++;
        }
      }

      await prisma.exerciseSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          exercisesAdded: added,
          exercisesUpdated: updated,
        },
      });

      return NextResponse.json({
        success: true,
        added,
        updated,
        total: exercises.length,
      });

    } catch (error) {
      await prisma.exerciseSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error during sync" },
      { status: 500 }
    );
  }
}
