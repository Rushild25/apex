import { RoutineBuilder } from "@/components/routines/RoutineBuilder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Routine | Hevy Clone",
};

export default function NewRoutinePage() {
  return <RoutineBuilder mode="create" />;
}
