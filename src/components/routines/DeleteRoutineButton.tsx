"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRoutine } from "@/app/actions/routines";

export function DeleteRoutineButton({ routineId }: { routineId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this routine?")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteRoutine(routineId);
      if (!res.success) {
        alert(res.error || "Failed to delete routine");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete routine");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-destructive hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
