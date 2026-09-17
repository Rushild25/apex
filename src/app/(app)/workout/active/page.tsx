import { ActiveWorkoutLogger } from "@/components/workout/ActiveWorkoutLogger";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Active Workout | APEX",
};

export default function ActiveWorkoutPage() {
  return <ActiveWorkoutLogger />;
}
