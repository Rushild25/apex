"use client";

import React, { useState } from "react";
import { FolderPlus, Folder, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRoutineFolder } from "@/app/actions/folders";
import { toast } from "sonner";

export function RoutineFolderHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createRoutineFolder(folderName.trim());
      if (res.success) {
        toast.success(`Created folder "${folderName.trim()}"`);
        setFolderName("");
        setIsOpen(false);
      } else {
        toast.error(res.error || "Failed to create folder");
      }
    } catch {
      toast.error("Failed to create folder");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        title="Create routine folder"
        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <FolderPlus className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border/80 text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Folder className="w-5 h-5 text-primary" />
            New Routine Folder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Folder Name
            </label>
            <input
              type="text"
              placeholder="e.g. Push Pull Legs, Upper Body..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !folderName.trim()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Create Folder
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
