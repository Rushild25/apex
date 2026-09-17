import { RoutineBuilder } from "@/components/routines/RoutineBuilder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Routine | APEX",
};

export default function NewRoutinePage() {
  return <RoutineBuilder mode="create" />;
}
