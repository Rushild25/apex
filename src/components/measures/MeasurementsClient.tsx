"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  Camera,
  X,
  Check,
  Scale,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface WeightRecord {
  id: string;
  date: string; // ISO or YYYY-MM-DD
  weight: number;
  unit: string;
}

interface MeasurementsClientProps {
  initialRecords: WeightRecord[];
  userId: string;
}

export function MeasurementsClient({ initialRecords, userId }: MeasurementsClientProps) {
  const [records, setRecords] = useState<WeightRecord[]>(initialRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 3 months");

  // Form states
  const [formDate, setFormDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formWeight, setFormWeight] = useState("");
  const [formWaist, setFormWaist] = useState("");
  const [formBodyFat, setFormBodyFat] = useState("");
  const [formNeck, setFormNeck] = useState("");
  const [formChest, setFormChest] = useState("");
  const [formBicep, setFormBicep] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Latest entry
  const latestRecord = records[0];

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWeight) {
      toast.error("Please enter a body weight");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/measures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formDate,
          weight: parseFloat(formWeight),
          waist: formWaist ? parseFloat(formWaist) : null,
          bodyFat: formBodyFat ? parseFloat(formBodyFat) : null,
          neck: formNeck ? parseFloat(formNeck) : null,
          chest: formChest ? parseFloat(formChest) : null,
          bicep: formBicep ? parseFloat(formBicep) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const newRecord: WeightRecord = {
        id: Math.random().toString(),
        date: formDate,
        weight: parseFloat(formWeight),
        unit: "kg",
      };

      setRecords((prev) => [newRecord, ...prev.filter((r) => r.date !== formDate)].sort((a, b) => (a.date < b.date ? 1 : -1)));
      toast.success("Measurement saved successfully!");
      setIsModalOpen(false);
      setFormWeight("");
    } catch (err) {
      // Fallback local update if offline or mock
      const newRecord: WeightRecord = {
        id: Math.random().toString(),
        date: formDate,
        weight: parseFloat(formWeight),
        unit: "kg",
      };
      setRecords((prev) => [newRecord, ...prev.filter((r) => r.date !== formDate)].sort((a, b) => (a.date < b.date ? 1 : -1)));
      toast.success("Measurement recorded!");
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Min and max for simple SVG line chart
  const chartRecords = [...records].reverse();
  const weights = chartRecords.map((r) => r.weight);
  const minWeight = weights.length > 0 ? Math.min(...weights) - 0.5 : 60;
  const maxWeight = weights.length > 0 ? Math.max(...weights) + 0.5 : 65;
  const weightRange = maxWeight - minWeight || 1;

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Measurements</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
        >
          <Plus className="w-6 h-6 stroke-[2.5px]" />
        </button>
      </div>

      {/* Main Metric Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-foreground">
            {latestRecord ? `${latestRecord.weight}kg` : "-- kg"}
          </span>
          <span className="text-xs text-[#0A84FF] font-semibold">
            {latestRecord ? format(new Date(latestRecord.date), "MMM d") : ""}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#0A84FF] font-semibold cursor-pointer">
          <span>{timeRange}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* SVG Line Chart (Screenshot 4) */}
      <div className="rounded-2xl bg-card border border-border/70 p-4 space-y-3 shadow-sm">
        <div className="h-44 w-full relative pt-2 pb-4">
          {weights.length >= 2 ? (
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="15%" x2="100%" y2="15%" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <line x1="0" y1="85%" x2="100%" y2="85%" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="#0A84FF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartRecords
                  .map((r, i) => {
                    const x = (i / (chartRecords.length - 1)) * 100;
                    const y = 85 - ((r.weight - minWeight) / weightRange) * 70;
                    return `${x}%,${y}%`;
                  })
                  .join(" ")}
              />

              {/* Data circles */}
              {chartRecords.map((r, i) => {
                const x = (i / (chartRecords.length - 1)) * 100;
                const y = 85 - ((r.weight - minWeight) / weightRange) * 70;
                return (
                  <circle
                    key={r.id || i}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="5"
                    fill="#0A84FF"
                    stroke="#0D0E11"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              Log at least 2 measurements to view progression chart
            </div>
          )}
        </div>

        {/* Chart X-axis dates */}
        <div className="flex justify-between text-[11px] text-muted-foreground font-medium px-1">
          <span>{chartRecords[0]?.date ? format(new Date(chartRecords[0].date), "MMM d") : ""}</span>
          <span>
            {chartRecords[chartRecords.length - 1]?.date
              ? format(new Date(chartRecords[chartRecords.length - 1]!.date), "MMM d")
              : ""}
          </span>
        </div>
      </div>

      {/* Filter Pill */}
      <div>
        <button className="px-5 py-2 rounded-full text-xs font-bold bg-[#0A84FF] text-white shadow">
          Weight
        </button>
      </div>

      {/* Weight History Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-foreground">Weight History</h3>

        {records.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border/70 text-xs text-muted-foreground">
            No weight entries logged yet. Tap `+` above to record your first entry.
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border/70 divide-y divide-border/60 overflow-hidden shadow-sm">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 text-sm">
                <span className="font-semibold text-foreground">
                  {format(new Date(record.date), "MMM d")}
                </span>
                <span className="font-bold text-foreground">{record.weight}kg</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Measurements Modal (Screenshots 2 & 3) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-background border-t sm:border border-border rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-sm font-semibold text-[#0A84FF] hover:opacity-80"
              >
                Cancel
              </button>
              <h2 className="text-base font-bold text-foreground">Log Measurements</h2>
              <button
                type="button"
                onClick={handleSaveMeasurement}
                disabled={isSubmitting}
                className="text-sm font-bold text-[#0A84FF] hover:opacity-80 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Date selector */}
              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="font-bold text-sm text-foreground">Date</span>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-foreground text-right border-none outline-none cursor-pointer"
                />
              </div>

              {/* Progress Picture */}
              <div className="space-y-2">
                <span className="font-bold text-sm text-foreground">Progress Picture</span>
                <div className="h-32 border border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center gap-2 text-[#0A84FF] bg-card/40 cursor-pointer hover:bg-card/70 transition-colors">
                  <Camera className="w-6 h-6" />
                  <span className="text-xs font-bold">Add Picture</span>
                </div>
              </div>

              {/* Measurements Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Measurements
                </h4>

                <div className="divide-y divide-border/60">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">Body Weight (kg)</span>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="63.0"
                      value={formWeight}
                      onChange={(e) => setFormWeight(e.target.value)}
                      className="w-24 text-right bg-transparent text-sm font-bold text-foreground border-b border-border focus:border-primary outline-none py-0.5"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">Waist (in)</span>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="-"
                      value={formWaist}
                      onChange={(e) => setFormWaist(e.target.value)}
                      className="w-24 text-right bg-transparent text-sm font-bold text-foreground border-b border-border focus:border-primary outline-none py-0.5"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">Body Fat (%)</span>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="-"
                      value={formBodyFat}
                      onChange={(e) => setFormBodyFat(e.target.value)}
                      className="w-24 text-right bg-transparent text-sm font-bold text-foreground border-b border-border focus:border-primary outline-none py-0.5"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">Neck (in)</span>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="-"
                      value={formNeck}
                      onChange={(e) => setFormNeck(e.target.value)}
                      className="w-24 text-right bg-transparent text-sm font-bold text-foreground border-b border-border focus:border-primary outline-none py-0.5"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">Chest (in)</span>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="-"
                      value={formChest}
                      onChange={(e) => setFormChest(e.target.value)}
                      className="w-24 text-right bg-transparent text-sm font-bold text-foreground border-b border-border focus:border-primary outline-none py-0.5"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">Left Bicep (in)</span>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="-"
                      value={formBicep}
                      onChange={(e) => setFormBicep(e.target.value)}
                      className="w-24 text-right bg-transparent text-sm font-bold text-foreground border-b border-border focus:border-primary outline-none py-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
