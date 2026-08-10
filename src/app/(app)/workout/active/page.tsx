import { ActiveWorkoutLogger } from "@/components/workout/ActiveWorkoutLogger";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Active Workout | Hevy Clone",
};

export default function ActiveWorkoutPage() {
  return <ActiveWorkoutLogger />;
}
