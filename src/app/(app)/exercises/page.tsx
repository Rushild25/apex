import { ExerciseBrowser } from "@/components/exercises/ExerciseBrowser";

export const dynamic = "force-dynamic";

export default function ExercisesPage() {
  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full flex flex-col h-[calc(100vh-4rem)] pb-24 md:pb-8">
      <ExerciseBrowser showBackArrow={true} />
    </div>
  );
}
