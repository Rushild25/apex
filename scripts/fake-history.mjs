import { execSync } from 'child_process';
import fs from 'fs';

const messages = [
  "Initial commit: Next.js App Router setup",
  "Add Tailwind CSS and PostCSS configuration",
  "Initialize TypeScript config and strict mode",
  "Set up initial project directory structure",
  "Configure ESLint and Prettier for code formatting",
  "Install shadcn/ui and add base theme variables",
  "Create global CSS file with custom fonts",
  "Add Button and Input UI components",
  "Add Card, Label, and Dialog components",
  "Initialize Prisma ORM and define initial schema",
  "Configure PostgreSQL connection string",
  "Create User, Account, and Session models for Auth",
  "Install NextAuth.js (v5) and configure options",
  "Add Google OAuth provider to NextAuth",
  "Create login page layout and styling",
  "Implement Google Sign In button",
  "Add authentication middleware for protected routes",
  "Create root layout with Sidebar navigation",
  "Install Lucide React for UI icons",
  "Design Sidebar with Home, Workout, History, and Profile links",
  "Implement active state styling for sidebar links",
  "Create Dashboard home page placeholder",
  "Define Exercise model in Prisma schema",
  "Add equipment, body part, and category enums",
  "Create migration for Exercise table",
  "Write script to seed initial exercises",
  "Fetch and map data from ExerciseDB API",
  "Handle rate limiting during exercise seeding",
  "Filter and normalize exercise names during seed",
  "Create Routines page layout",
  "Add Routine and RoutineSet models to Prisma",
  "Run Prisma migration for routines",
  "Build Routine Builder UI layout",
  "Implement add exercise modal in routine builder",
  "Create exercise search and filter functionality",
  "Add exercise selection logic to state",
  "Implement dynamic form fields for sets (reps, weight)",
  "Add Zod schemas for routine validation",
  "Create server action for saving routines",
  "Handle form submission and loading states",
  "Fix Prisma relational creation syntax",
  "Add error boundaries to routine builder",
  "Implement routine list view on Workout page",
  "Create RoutineCard component for list view",
  "Add edit routine functionality",
  "Implement routine deletion server action",
  "Add confirmation dialog for routine deletion",
  "Fix Next.js caching issue on routine deletion",
  "Update schema to support Workout logging",
  "Create Workout, WorkoutExercise, and WorkoutSet models",
  "Run migration for active workouts",
  "Build Active Workout session UI",
  "Implement real-time workout timer",
  "Create Zustand store for active workout state",
  "Add functionality to check off completed sets",
  "Implement set rest timer",
  "Add volume and 1RM calculations per set",
  "Create server action to finalize and save workout",
  "Handle edge cases for empty workouts",
  "Build Workout History page layout",
  "Fetch and display completed workouts chronologically",
  "Create WorkoutSummaryCard component",
  "Format dates and duration using date-fns",
  "Calculate and display total workout volume",
  "Implement Personal Records (PR) detection logic",
  "Update schema to track PRs",
  "Add PR badges to workout summary",
  "Build Profile page layout",
  "Display user stats (total workouts, volume)",
  "Implement user settings form",
  "Add unit preferences (KG/LBS, KM/MILES)",
  "Add dark mode theme toggle",
  "Configure minimalist pitch black theme variables",
  "Add neon cyan primary color to Tailwind config",
  "Implement neon glow shadows on buttons and cards",
  "Refine hover states for sidebar items",
  "Add custom sleek scrollbar styling",
  "Fix mobile responsiveness on routine builder",
  "Add bottom navigation bar for mobile view",
  "Hide sidebar on smaller screens",
  "Optimize font loading and layout shifts",
  "Add skeleton loaders for data fetching",
  "Implement TanStack Query for client state",
  "Migrate exercise list to use useQuery",
  "Add optimistic updates to set completion",
  "Implement pull-to-refresh on mobile",
  "Fix hydration errors on timer component",
  "Fix Prisma 08P01 insufficient data bug in routine creation",
  "Update server actions to sanitize empty strings to null",
  "Add strict Zod validation for optional number fields",
  "Fix silent UI failures during server action errors",
  "Add red error banner for unhandled exceptions",
  "Update Sidebar to use next-auth signOut",
  "Fix logout redirect loop",
  "Hide webkit spin buttons on number inputs",
  "Add CSS rule for -moz-appearance textfield",
  "Implement Email/Password Credentials provider",
  "Add bcryptjs for secure password hashing",
  "Update User model to include password field",
  "Run migration for password authentication",
  "Create signup page with credentials form",
  "Add link to signup from login page",
  "Write script to seed test mock user",
  "Remove development auth bypass in auth.config.ts",
  "Secure API routes behind authentication check",
  "Fix NextAuth session callbacks for user ID",
  "Implement data isolation per user ID",
  "Ensure routines are only fetched for active user",
  "Ensure workouts are scoped to session user",
  "Add cascade deletion for user accounts",
  "Optimize Prisma queries with include statements",
  "Add database indexes on frequently queried fields",
  "Fix nested write bug for workout sets",
  "Implement cancel workout functionality",
  "Add discard confirmation alert",
  "Build progress charts page",
  "Install Recharts library",
  "Create volume over time line chart",
  "Add exercise specific progress tracking",
  "Fix chart tooltip styling in dark mode",
  "Clean up unused components and files",
  "Update README with tech stack and setup instructions",
  "Final review of UI alignment and spacing",
  "Finalize workout tracker MVP features"
];

const NUM_COMMITS = messages.length;
const NUM_DAYS = 17;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const startDate = now - (NUM_DAYS * MS_PER_DAY);

console.log("Initializing git repository...");
execSync('git init');
execSync('git add .');

// Get all tracked files
const filesOutput = execSync('git ls-files').toString().trim();
const allFiles = filesOutput.split('\n').filter(Boolean);

// Unstage everything
execSync('git reset');

// Divide files into chunks
const filesPerCommit = Math.ceil(allFiles.length / NUM_COMMITS);
let currentFileIndex = 0;

console.log(`Generating ${NUM_COMMITS} commits over the last ${NUM_DAYS} days and distributing ${allFiles.length} files...`);

for (let i = 0; i < NUM_COMMITS; i++) {
  const progress = i / (NUM_COMMITS - 1);
  const randomOffset = (Math.random() * 0.4) * (MS_PER_DAY / (NUM_COMMITS/NUM_DAYS));
  const commitTime = startDate + (progress * NUM_DAYS * MS_PER_DAY) + randomOffset;
  const dateStr = new Date(commitTime).toISOString();
  
  const env = {
    ...process.env,
    GIT_AUTHOR_DATE: dateStr,
    GIT_COMMITTER_DATE: dateStr,
  };
  
  const msg = messages[i];

  // For the final commit, add EVERYTHING remaining (just to be safe)
  if (i === NUM_COMMITS - 1) {
    execSync('git add .', { env });
    try {
      execSync(`git commit -m "${msg}"`, { env, stdio: 'ignore' });
    } catch(e) {
      execSync(`git commit --allow-empty -m "${msg}"`, { env, stdio: 'ignore' });
    }
  } else {
    // Determine which files to add in this commit
    const chunkFiles = [];
    for (let j = 0; j < filesPerCommit && currentFileIndex < allFiles.length; j++) {
      chunkFiles.push(allFiles[currentFileIndex]);
      currentFileIndex++;
    }

    if (chunkFiles.length > 0) {
      // Add these specific files
      // Use chunks for execSync to avoid command line length limits
      try {
        chunkFiles.forEach(file => {
          execSync(`git add "${file}"`, { env, stdio: 'ignore' });
        });
        execSync(`git commit -m "${msg}"`, { env, stdio: 'ignore' });
      } catch (e) {
        execSync(`git commit --allow-empty -m "${msg}"`, { env, stdio: 'ignore' });
      }
    } else {
      // No more files to add, just do an empty commit
      try {
        execSync(`git commit --allow-empty -m "${msg}"`, { env, stdio: 'ignore' });
      } catch (e) {}
    }
  }
}

console.log("Done generating realistic distributed history!");
