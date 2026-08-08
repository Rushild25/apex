import { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';
import { TARGET_EXERCISES } from './seed-data';

const prisma = new PrismaClient();

async function fetchExerciseDB() {
  console.log("Fetching ExerciseDB data...");
  let allData: any[] = [];
  let url = 'https://oss.exercisedb.dev/api/v1/exercises?limit=100';
  
  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 429) {
        console.warn(`Hit rate limit (429). Waiting 5 seconds before retrying...`);
        await new Promise(r => setTimeout(r, 5000));
        continue;
      } else {
        console.warn(`Failed to fetch from ExerciseDB (status ${res.status}). Aborting pagination.`);
        break;
      }
    }
    const json = await res.json();
    if (json.data && Array.isArray(json.data)) {
      allData = allData.concat(json.data);
      console.log(`Fetched ${allData.length} exercises so far...`);
    }
    if (json.meta && json.meta.hasNextPage && json.meta.nextCursor) {
      url = `https://oss.exercisedb.dev/api/v1/exercises?limit=100&cursor=${json.meta.nextCursor}`;
      await new Promise(r => setTimeout(r, 1000)); // Rate limit protection
    } else {
      break;
    }
  }
  return allData;
}

async function main() {
  try {
    const apiData = await fetchExerciseDB();
    console.log(`Fetched ${apiData.length} exercises from ExerciseDB`);

    // Setup fuzzy search on the apiData
    // The ExerciseDB API has fields like: name, bodyPart, target, equipment, gifUrl, instructions
    const fuse = new Fuse(apiData, {
      keys: ['name'],
      threshold: 0.3, // Require a relatively strict match
      includeScore: true
    });

    const results = {
      total: 0,
      withAnimation: 0,
      withInstructions: 0,
      muscles: {} as Record<string, number>,
      equipment: {} as Record<string, number>
    };

    console.log("Starting DB insertion...");

    for (const target of TARGET_EXERCISES) {
      // Find a match in ExerciseDB
      let bestMatch: any = null;
      
      for (const query of target.searchQueries) {
        const matches = fuse.search(query);
        // Look for the best match that also matches equipment loosely if possible
        if (matches.length > 0) {
          bestMatch = matches[0]!.item;
          break; // Stop at first good query match
        }
      }

      // Prepare instructions and gifUrl
      let instructions: string[] = [];
      let gifUrl: string | null = null;
      let source = "Custom/Web";

      if (bestMatch) {
        gifUrl = bestMatch.gifUrl || null;
        if (Array.isArray(bestMatch.instructions) && bestMatch.instructions.length > 0) {
          instructions = bestMatch.instructions;
        } else if (typeof bestMatch.instructions === 'string') {
          instructions = [bestMatch.instructions];
        }
        source = "ExerciseDB";
      }

      if (instructions.length === 0) {
        instructions = ["Perform the exercise with proper form."];
      }

      // Ensure no duplicates by (name)
      const normalizedName = target.name.toLowerCase();

      await prisma.exercise.upsert({
        where: {
          externalId: bestMatch?.exerciseId ? `edb-${bestMatch.exerciseId}` : `seed-${normalizedName.replace(/\s+/g, '-')}`
        },
        update: {
          name: target.name,
          normalizedName,
          target: target.target,
          secondaryMuscles: target.secondaryMuscles,
          equipment: target.equipment,
          instructions,
          gifUrl,
          source: 'SYSTEM',
          userId: null
        },
        create: {
          externalId: bestMatch?.exerciseId ? `edb-${bestMatch.exerciseId}` : `seed-${normalizedName.replace(/\s+/g, '-')}`,
          name: target.name,
          normalizedName,
          target: target.target,
          secondaryMuscles: target.secondaryMuscles,
          equipment: target.equipment,
          instructions,
          gifUrl,
          source: 'SYSTEM',
          userId: null
        }
      });

      // Update statistics
      results.total++;
      if (gifUrl) results.withAnimation++;
      if (instructions.length > 1 || instructions[0] !== "Perform the exercise with proper form.") {
        results.withInstructions++;
      }
      results.muscles[target.target] = (results.muscles[target.target] || 0) + 1;
      results.equipment[target.equipment] = (results.equipment[target.equipment] || 0) + 1;
    }

    console.log("\n=================================");
    console.log("DATABASE VALIDATION REPORT");
    console.log("=================================");
    console.log(`Total exercises seeded: ${results.total}`);
    console.log(`System exercises: ${results.total}`);
    console.log(`Custom exercises: 0`);
    console.log("\n--- Breakdown by Muscle ---");
    for (const [m, count] of Object.entries(results.muscles).sort((a,b) => b[1] - a[1])) {
      console.log(`${m}: ${count}`);
    }
    console.log("\n--- Breakdown by Equipment ---");
    for (const [e, count] of Object.entries(results.equipment).sort((a,b) => b[1] - a[1])) {
      console.log(`${e}: ${count}`);
    }
    console.log("\n--- Data Quality ---");
    console.log(`Exercises with animations: ${results.withAnimation}`);
    console.log(`Exercises without animations: ${results.total - results.withAnimation}`);
    console.log(`Exercises with instructions: ${results.withInstructions}`);
    console.log(`Exercises without instructions: ${results.total - results.withInstructions}`);
    console.log("=================================\n");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

main().finally(() => prisma.$disconnect());
