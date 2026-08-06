/**
 * Seed script — fetches all exercises from ExerciseDB v1 OSS (free, no auth)
 * and upserts them into the local PostgreSQL database.
 *
 * Run with:  npx tsx prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE = "https://oss.exercisedb.dev/api/v1";

interface ExerciseDBEntry {
  exerciseId: string;
  name: string;
  gifUrl?: string;
  bodyParts?: string[];
  equipments?: string[];
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

async function fetchAll(): Promise<ExerciseDBEntry[]> {
  const limit = 25;
  const all: ExerciseDBEntry[] = [];
  let cursor: string | null = null;

  while (true) {
    const url = cursor
      ? `${BASE}/exercises?limit=${limit}&cursor=${cursor}`
      : `${BASE}/exercises?limit=${limit}`;

    process.stdout.write(`\r  Fetching (total so far: ${all.length})...`);
    
    let res: Response | null = null;
    for (let attempt = 1; attempt <= 5; attempt++) {
      res = await fetch(url, { headers: { Accept: "application/json" } });
      if (res.status === 429) {
        const wait = attempt * 35000;
        process.stdout.write(`\r  Rate limited — waiting ${wait/1000}s (attempt ${attempt})...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      break;
    }
    if (!res || !res.ok) throw new Error(`ExerciseDB error ${res?.status}: ${await res?.text()}`);


    const json = await res.json() as any;
    const items: ExerciseDBEntry[] = json.data ?? [];
    all.push(...items);

    if (!json.meta?.hasNextPage) break;
    cursor = json.meta?.nextCursor ?? null;
    if (!cursor) break;

    if (all.length >= 200) break; // Limit to 200 for quick seeding

    // Small pause to avoid rate limits
    await new Promise(r => setTimeout(r, 1500));
  }

  return all;
}

async function main() {
  console.log("🏋️  Seeding exercises from ExerciseDB OSS…");

  let exercises: ExerciseDBEntry[];
  try {
    exercises = await fetchAll();
  } catch (e: any) {
    console.error("\nFailed to fetch from ExerciseDB:", e.message);
    process.exit(1);
  }

  console.log(`\n\n📦 Upserting ${exercises.length} exercises into DB…`);

  let count = 0;
  const BATCH = 50;

  for (let i = 0; i < exercises.length; i += BATCH) {
    const batch = exercises.slice(i, i + BATCH);

    await Promise.all(
      batch.map((ex) =>
        prisma.exercise.upsert({
          where: { externalId: ex.exerciseId },
          update: {
            name: ex.name,
            normalizedName: normalize(ex.name),
            bodyPart: ex.bodyParts?.[0] ?? null,
            target: ex.targetMuscles?.[0] ?? null,
            equipment: ex.equipments?.[0] ?? null,
            gifUrl: ex.gifUrl ?? null,
          },
          create: {
            externalId: ex.exerciseId,
            source: "SYSTEM",
            name: ex.name,
            normalizedName: normalize(ex.name),
            bodyPart: ex.bodyParts?.[0] ?? null,
            target: ex.targetMuscles?.[0] ?? null,
            equipment: ex.equipments?.[0] ?? null,
            gifUrl: ex.gifUrl ?? null,
          },
        })
      )
    );

    count += batch.length;
    process.stdout.write(`\r  Saved: ${count}/${exercises.length}`);
  }

  console.log(`\n✅ Done! Seeded ${count} exercises.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
