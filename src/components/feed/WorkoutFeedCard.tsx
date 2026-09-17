"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreVertical,
  Award,
  Dumbbell,
  Send,
  X,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleWorkoutLike, addWorkoutComment, getWorkoutComments } from "@/app/actions/social";

export interface FeedWorkout {
  id: string;
  title: string;
  completedAt: Date | string | null;
  startedAt: Date | string;
  durationSec: number | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  workoutNumber?: number;
  prCount?: number;
  totalVolume: number;
  likesCount?: number;
  hasLiked?: boolean;
  commentsCount?: number;
  exercises: {
    id: string;
    exerciseName: string;
    setsCount: number;
    target?: string | null;
    gifUrl?: string | null;
  }[];
}

interface WorkoutFeedCardProps {
  workout: FeedWorkout;
}

interface CommentItem {
  id: string;
  content: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export function WorkoutFeedCard({ workout }: WorkoutFeedCardProps) {
  const [likes, setLikes] = useState(workout.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(workout.hasLiked || false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Comment Sheet state
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0m";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formattedVolume = new Intl.NumberFormat("en-US").format(Math.round(workout.totalVolume));

  const handleLike = async () => {
    // Optimistic update
    if (hasLiked) {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }

    try {
      await toggleWorkoutLike(workout.id);
    } catch {
      // Revert if failed
    }
  };

  const handleOpenComments = async () => {
    setIsCommentSheetOpen(true);
    setIsLoadingComments(true);
    try {
      const res = await getWorkoutComments(workout.id);
      if (res.success && res.comments) {
        setComments(res.comments as any);
      }
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsPostingComment(true);
    try {
      const res = await addWorkoutComment(workout.id, newComment.trim());
      if (res.success && res.comment) {
        setComments((prev) => [...prev, res.comment as any]);
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${workout.user.name || "Athlete"}'s Workout on APEX`,
      text: `Checked out this ${workout.title} workout: ${formatDuration(workout.durationSec)} and ${formattedVolume} kg lifted!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Workout link copied to clipboard!");
    }
  };

  const displayedExercises = isExpanded ? workout.exercises : workout.exercises.slice(0, 3);
  const remainingCount = workout.exercises.length - 3;

  return (
    <div className="rounded-2xl bg-card border border-border/70 p-4 shadow-sm space-y-3.5 transition-all">
      {/* User Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/20 to-primary/20 border border-border flex items-center justify-center overflow-hidden shrink-0">
            {workout.user.image ? (
              <Image
                src={workout.user.image}
                alt={workout.user.name || "User"}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            ) : (
              <Dumbbell className="w-5 h-5 text-primary" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-foreground">{workout.user.name || "APEX Athlete"}</span>
              {workout.workoutNumber && (
                <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-[11px] font-semibold text-foreground/80">
                  <Dumbbell className="w-3 h-3 text-primary" />
                  {workout.workoutNumber}th workout
                </span>
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              {workout.completedAt
                ? formatDistanceToNow(new Date(workout.completedAt), { addSuffix: true })
                : "Recently"}
            </span>
          </div>
        </div>

        <button className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Workout Title */}
      <div>
        <h2 className="text-lg font-black tracking-tight text-foreground">{workout.title}</h2>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/50 text-xs">
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Time</span>
          <span className="font-bold text-sm text-foreground">{formatDuration(workout.durationSec)}</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Volume</span>
          <span className="font-bold text-sm text-foreground">{formattedVolume} kg</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Records</span>
          <span className="font-bold text-sm text-foreground flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {workout.prCount ?? 0}
          </span>
        </div>
      </div>

      {/* Exercise Previews */}
      <div className="space-y-2.5 pt-1">
        {displayedExercises.map((ex, idx) => (
          <div key={ex.id || idx} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
              {ex.gifUrl ? (
                <Image src={ex.gifUrl} alt={ex.exerciseName} width={40} height={40} className="object-cover" />
              ) : (
                <Dumbbell className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="text-xs font-medium text-foreground truncate">
              <span className="font-bold text-foreground mr-1.5">{ex.setsCount} sets</span>
              <span className="text-muted-foreground">{ex.exerciseName}</span>
            </div>
          </div>
        ))}

        {workout.exercises.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors pt-1"
          >
            {isExpanded ? "Show less" : `See ${remainingCount} more exercises`}
          </button>
        )}
      </div>

      {/* Social Actions (Screenshots 34 & 35) */}
      <div className="flex items-center justify-between pt-2 text-muted-foreground border-t border-border/40">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold p-1.5 rounded-lg transition-colors hover:bg-muted",
            hasLiked && "text-[#0A84FF]"
          )}
        >
          <ThumbsUp className={cn("w-4 h-4", hasLiked && "fill-[#0A84FF] text-[#0A84FF]")} />
          <span>{likes > 0 ? likes : ""}</span>
        </button>

        <button
          onClick={handleOpenComments}
          className="flex items-center gap-1.5 text-xs font-semibold p-1.5 rounded-lg transition-colors hover:bg-muted hover:text-foreground"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{comments.length > 0 ? comments.length : ""}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold p-1.5 rounded-lg transition-colors hover:bg-muted hover:text-foreground"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comment Bottom Sheet */}
      {isCommentSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-lg bg-background border-t border-border rounded-t-3xl max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
              <h3 className="font-bold text-base text-foreground">Comments</h3>
              <button
                onClick={() => setIsCommentSheetOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {isLoadingComments ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No comments yet. Say something motivating!
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Dumbbell className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">{c.user.name || "Athlete"}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/90">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment input form */}
            <form onSubmit={handlePostComment} className="p-4 border-t border-border flex items-center gap-2 bg-card">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-muted px-4 py-2.5 rounded-full text-xs font-medium text-foreground outline-none border border-border focus:border-primary"
              />
              <button
                type="submit"
                disabled={isPostingComment || !newComment.trim()}
                className="p-2.5 rounded-full bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
