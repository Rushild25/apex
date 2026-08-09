import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProgressForm } from "./ProgressForm";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const entries = await prisma.progressEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Progress Tracking</h1>
      <ProgressForm />
      <div className="mt-8 space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="p-4 border rounded-lg bg-card">
            <div className="flex justify-between">
              <span className="font-semibold">{entry.date.toLocaleDateString()}</span>
              <span>{entry.bodyWeight} {entry.weightUnit}</span>
            </div>
            {entry.notes && <p className="text-muted-foreground text-sm mt-2">{entry.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

