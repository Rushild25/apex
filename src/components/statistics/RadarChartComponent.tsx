"use client";

import React, { useState } from "react";
import { ChevronDown, ArrowUp, Check, Share2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface RadarData {
  back: number;
  chest: number;
  core: number;
  shoulders: number;
  arms: number;
  legs: number;
}

export interface PeriodMetrics {
  workouts: number;
  durationSec: number;
  volumeKg: number;
  sets: number;
}

interface RadarChartComponentProps {
  currentData: RadarData;
  previousData?: RadarData;
  metrics: PeriodMetrics;
  previousMetrics?: PeriodMetrics;
  periodLabel?: string;
  previousLabel?: string;
}

export function RadarChartComponent({
  currentData,
  previousData,
  metrics,
  previousMetrics,
  periodLabel = "Current",
  previousLabel = "Previous",
}: RadarChartComponentProps) {
  const [selectedRange, setSelectedRange] = useState("Last 30 days");
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);

  const axes = [
    { name: "Back", key: "back" as keyof RadarData, angle: 90 },
    { name: "Chest", key: "chest" as keyof RadarData, angle: 30 },
    { name: "Core", key: "core" as keyof RadarData, angle: 330 },
    { name: "Shoulders", key: "shoulders" as keyof RadarData, angle: 270 },
    { name: "Arms", key: "arms" as keyof RadarData, angle: 210 },
    { name: "Legs", key: "legs" as keyof RadarData, angle: 150 },
  ];

  // Maximum value across axes
  const maxVal = Math.max(
    ...axes.map((a) => Math.max(currentData[a.key] || 0, previousData ? previousData[a.key] || 0 : 0)),
    10
  );

  const cx = 150;
  const cy = 130;
  const radius = 95;

  const getCoordinates = (value: number, angleDegrees: number) => {
    const angleRad = (angleDegrees * Math.PI) / 180;
    const r = (Math.min(value, maxVal) / maxVal) * radius;
    // Note: in SVG, y goes downwards, so sin is inverted for standard compass
    const x = cx + r * Math.cos(angleRad);
    const y = cy - r * Math.sin(angleRad);
    return { x, y };
  };

  // Build polygon points
  const currentPoints = axes
    .map((a) => {
      const coord = getCoordinates(currentData[a.key] || 0, a.angle);
      return `${coord.x},${coord.y}`;
    })
    .join(" ");

  const previousPoints = previousData
    ? axes
        .map((a) => {
          const coord = getCoordinates(previousData[a.key] || 0, a.angle);
          return `${coord.x},${coord.y}`;
        })
        .join(" ")
    : "";

  const formatDuration = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs}h ${mins}min`;
  };

  const formatVolume = (kg: number) => {
    const k = Math.round(kg / 1000);
    return k > 0 ? `${k}k kg` : `${Math.round(kg)} kg`;
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsRangeModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-card border border-border/70 text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
        >
          <span>{selectedRange}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Hexagonal Radar Chart */}
      <div className="rounded-3xl bg-card border border-border/70 p-4 space-y-4 shadow-sm flex flex-col items-center">
        <svg viewBox="0 0 300 280" className="w-full max-w-[280px] h-64 overflow-visible">
          {/* Concentric Web Polygons */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((step, idx) => {
            const r = radius * step;
            const points = axes
              .map((a) => {
                const angleRad = (a.angle * Math.PI) / 180;
                const x = cx + r * Math.cos(angleRad);
                const y = cy - r * Math.sin(angleRad);
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={idx}
                points={points}
                fill="none"
                stroke="rgba(255, 255, 255, 0.09)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis radiating lines */}
          {axes.map((a) => {
            const coord = getCoordinates(maxVal, a.angle);
            return (
              <line
                key={a.name}
                x1={cx}
                y1={cy}
                x2={coord.x}
                y2={coord.y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Previous Period Polygon */}
          {previousPoints && (
            <polygon
              points={previousPoints}
              fill="rgba(255, 255, 255, 0.1)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
            />
          )}

          {/* Current Period Polygon */}
          <polygon
            points={currentPoints}
            fill="rgba(10, 132, 255, 0.25)"
            stroke="#0A84FF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Axis Labels */}
          {axes.map((a) => {
            const labelCoord = getCoordinates(maxVal + 14, a.angle);
            return (
              <text
                key={a.name}
                x={labelCoord.x}
                y={labelCoord.y + 4}
                textAnchor="middle"
                className="text-[10px] font-bold fill-muted-foreground uppercase tracking-wider"
              >
                {a.name}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs font-semibold pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0A84FF]" />
            <span className="text-foreground">{periodLabel}</span>
          </div>
          {previousData && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">{previousLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2x2 Metric Cards (Screenshots 25 & 26) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Workouts */}
        <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
          <span className="text-xs font-bold text-muted-foreground">Workouts</span>
          <span className="block text-2xl font-black text-foreground">{metrics.workouts}</span>
          <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{metrics.workouts}</span>
          </div>
        </div>

        {/* Duration */}
        <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
          <span className="text-xs font-bold text-muted-foreground">Duration</span>
          <span className="block text-2xl font-black text-foreground">
            {formatDuration(metrics.durationSec)}
          </span>
          <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{formatDuration(metrics.durationSec)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
          <span className="text-xs font-bold text-muted-foreground">Volume</span>
          <span className="block text-2xl font-black text-foreground">
            {formatVolume(metrics.volumeKg)}
          </span>
          <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{formatVolume(metrics.volumeKg)}</span>
          </div>
        </div>

        {/* Sets */}
        <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
          <span className="text-xs font-bold text-muted-foreground">Sets</span>
          <span className="block text-2xl font-black text-foreground">{metrics.sets}</span>
          <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{metrics.sets}</span>
          </div>
        </div>
      </div>

      {/* Time range sheet modal (Screenshot 25) */}
      {isRangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-lg bg-background border-t border-border rounded-t-3xl p-6 space-y-3 animate-in slide-in-from-bottom-5">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3" />
            {["Last 30 days", "Last 3 months", "Year", "All time"].map((r) => {
              const isSelected = selectedRange === r;
              const isPro = r === "Year" || r === "All time";

              return (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRange(r);
                    setIsRangeModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-muted/60 transition-colors font-bold text-sm text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <span>{r}</span>
                    {isPro && (
                      <span className="bg-amber-400/20 text-amber-400 text-[10px] px-2 py-0.5 rounded font-black">
                        PRO
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#0A84FF]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
