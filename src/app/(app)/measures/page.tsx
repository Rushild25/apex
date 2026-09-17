import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { MeasurementsClient, WeightRecord } from "@/components/measures/MeasurementsClient";

export const dynamic = "force-dynamic";

export default async function MeasuresPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const entries = await prisma.progressEntry.findMany({
    where: {
      userId,
      bodyWeight: { not: null },
    },
    orderBy: { date: "desc" },
  });

  const formattedRecords: WeightRecord[] = entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    weight: e.bodyWeight!,
    unit: e.weightUnit.toLowerCase(),
  }));

  return <MeasurementsClient initialRecords={formattedRecords} userId={userId} />;
}
