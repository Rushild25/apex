"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addProgressEntry } from "@/app/actions/progress";

export function ProgressForm() {
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    setLoading(true);
    try {
      await addProgressEntry(parseFloat(weight), notes);
      setWeight("");
      setNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold">Log Body Weight</h3>
      <div>
        <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight (kg)" className="w-full p-2 border rounded" required />
      </div>
      <div>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" className="w-full p-2 border rounded" />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Log Weight"}</Button>
    </form>
  );
}

