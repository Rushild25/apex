"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnatomyBodyMapProps {
  activeMuscles: Record<string, number>; // muscle name -> set count or volume
  className?: string;
}

export function AnatomyBodyMap({ activeMuscles, className }: AnatomyBodyMapProps) {
  const getMuscleSets = (muscleKey: string) => {
    const key = muscleKey.toLowerCase();
    return Object.entries(activeMuscles).reduce((acc, [m, val]) => {
      return m.toLowerCase().includes(key) ? acc + val : acc;
    }, 0);
  };

  const getMuscleColor = (muscleKey: string) => {
    const sets = getMuscleSets(muscleKey);
    if (sets === 0) return "#22252B";
    if (sets < 5) return "#1D5BBF"; // subtle/medium blue
    if (sets < 10) return "#2B7FFF"; // strong blue
    return "#0A84FF"; // bright electric blue
  };

  return (
    <div className={cn("flex items-center justify-center gap-6 py-4 select-none", className)}>
      {/* Front View */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
          Front
        </span>
        <svg
          viewBox="0 0 160 300"
          className="w-32 h-64 overflow-visible filter drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head & Neck */}
          <circle cx="80" cy="24" r="14" fill="#323640" />
          <path
            d="M72 38 L88 38 L92 48 L68 48 Z"
            fill={getMuscleColor("neck")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Shoulders (Deltoids) */}
          <path
            d="M48 54 C46 62 48 74 54 80 C57 74 62 62 60 52 Z"
            fill={getMuscleColor("shoulder")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M112 54 C114 62 112 74 106 80 C103 74 98 62 100 52 Z"
            fill={getMuscleColor("shoulder")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Chest (Pecs) */}
          <path
            d="M62 52 C72 52 79 56 79 74 C70 76 60 74 56 68 C56 60 58 54 62 52 Z"
            fill={getMuscleColor("chest")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M98 52 C88 52 81 56 81 74 C90 76 100 74 104 68 C104 60 102 54 98 52 Z"
            fill={getMuscleColor("chest")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Biceps */}
          <path
            d="M44 80 C40 88 42 104 46 112 C50 106 52 94 48 82 Z"
            fill={getMuscleColor("bicep")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M116 80 C120 88 118 104 114 112 C110 106 108 94 112 82 Z"
            fill={getMuscleColor("bicep")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Forearms */}
          <path
            d="M38 114 C32 126 30 146 32 160 C36 156 42 138 44 120 Z"
            fill={getMuscleColor("forearm")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M122 114 C128 126 130 146 128 160 C124 156 118 138 116 120 Z"
            fill={getMuscleColor("forearm")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Abdominals (Abs) */}
          <path
            d="M68 76 L92 76 L90 126 L70 126 Z"
            fill={getMuscleColor("abdom")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Pelvis / Hips */}
          <path d="M68 126 L92 126 L94 146 L66 146 Z" fill="#323640" stroke="#121316" strokeWidth="1" />

          {/* Quadriceps (Thighs) */}
          <path
            d="M64 148 C62 166 60 196 66 216 C74 216 78 196 78 174 C78 156 76 148 64 148 Z"
            fill={getMuscleColor("quad")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M96 148 C98 166 100 196 94 216 C86 216 82 196 82 174 C82 156 84 148 96 148 Z"
            fill={getMuscleColor("quad")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Calves (Front Shin/Calves) */}
          <path
            d="M64 224 C60 240 60 268 64 286 C68 286 72 268 72 248 C72 232 70 224 64 224 Z"
            fill={getMuscleColor("calf")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M96 224 C100 240 100 268 96 286 C92 286 88 268 88 248 C88 232 90 224 96 224 Z"
            fill={getMuscleColor("calf")}
            stroke="#121316"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Back View */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
          Back
        </span>
        <svg
          viewBox="0 0 160 300"
          className="w-32 h-64 overflow-visible filter drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <circle cx="80" cy="24" r="14" fill="#323640" />

          {/* Traps (Upper Trapezius) */}
          <path
            d="M70 38 L90 38 L102 58 L80 72 L58 58 Z"
            fill={getMuscleColor("trap")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Upper Back / Lats */}
          <path
            d="M58 58 L78 72 L78 116 L56 100 C52 86 52 70 58 58 Z"
            fill={getMuscleColor("lat") || getMuscleColor("back")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M102 58 L82 72 L82 116 L104 100 C108 86 108 70 102 58 Z"
            fill={getMuscleColor("lat") || getMuscleColor("back")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Triceps */}
          <path
            d="M46 76 C42 86 42 102 46 112 C50 106 52 92 48 78 Z"
            fill={getMuscleColor("tricep")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M114 76 C118 86 118 102 114 112 C110 106 108 92 112 78 Z"
            fill={getMuscleColor("tricep")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Lower Back */}
          <path
            d="M70 114 L90 114 L92 136 L68 136 Z"
            fill={getMuscleColor("lower back")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Glutes */}
          <path
            d="M62 136 C70 136 78 140 78 158 C74 168 64 168 58 156 Z"
            fill={getMuscleColor("glute")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M98 136 C90 136 82 140 82 158 C86 168 96 168 102 156 Z"
            fill={getMuscleColor("glute")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Hamstrings */}
          <path
            d="M60 166 C60 184 62 206 66 220 C74 220 76 200 76 178 C76 168 74 166 60 166 Z"
            fill={getMuscleColor("hamstring")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M100 166 C100 184 98 206 94 220 C86 220 84 200 84 178 C84 168 86 166 100 166 Z"
            fill={getMuscleColor("hamstring")}
            stroke="#121316"
            strokeWidth="1"
          />

          {/* Calves (Gastrocnemius) */}
          <path
            d="M62 226 C58 244 58 266 64 286 C68 286 72 268 72 248 C72 232 68 226 62 226 Z"
            fill={getMuscleColor("calf")}
            stroke="#121316"
            strokeWidth="1"
          />
          <path
            d="M98 226 C102 244 102 266 96 286 C92 286 88 268 88 248 C88 232 92 226 98 226 Z"
            fill={getMuscleColor("calf")}
            stroke="#121316"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
