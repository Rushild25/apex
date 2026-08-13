"use client";

import { useState, useCallback } from "react";
import { useForm, useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoutineSchema, CreateRoutineInput } from "@/validations/routine";
import { createRoutine } from "@/app/actions/routines";
import { useRouter } from "next/navigation";
import { useExercises } from "@/hooks/use-exercises";
import { useDebounce } from "use-debounce";
import { ArrowLeft, Search, Loader2, Plus, Trash2,
  GripVertical, Check, Dumbbell, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExerciseResult {
  id: string;
  name: string;
  bodyPart: string | null;
  equipment: string | null;
  target: string | null;
}

// ─── Sortable Set Row ─────────────────────────────────────────────────────────
function SetRow({
  index, setIdx, control, register, onRemove,
}: {
  index: number; setIdx: number; control: Control<CreateRoutineInput>; register: UseFormRegister<CreateRoutineInput>; onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[32px_100px_1fr_1fr_32px] gap-2 items-center px-2 py-1 rounded-md hover:bg-muted/40 group">
      <span className="text-center text-sm font-semibold text-muted-foreground">{setIdx + 1}</span>

      <FormField
        control={control}
        name={`exercises.${index}.sets.${setIdx}.setType`}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="h-8 text-xs border-transparent bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="WARMUP">Warmup</SelectItem>
              <SelectItem value="DROPSET">Drop Set</SelectItem>
              <SelectItem value="FAILURE">Failure</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Input
        type="text"
        placeholder="8–12"
        className="h-8 text-center text-sm"
        {...register(`exercises.${index}.sets.${setIdx}.targetReps`)}
      />

      <Input
        type="number"
        placeholder="kg"
        className="h-8 text-center text-sm"
        {...register(`exercises.${index}.sets.${setIdx}.targetWeight`, {
          setValueAs: (v: string) => v === "" || isNaN(parseFloat(v)) ? null : parseFloat(v),
        })}
      />

      <button
        type="button"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Sortable Exercise Card ───────────────────────────────────────────────────
function ExerciseCard({
  id, index, control, register, removeExercise, name,
}: {
  id: string; index: number; control: Control<CreateRoutineInput>; register: UseFormRegister<CreateRoutineInput>;
  removeExercise: (i: number) => void; name: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { fields: sets, append, remove } = useFieldArray({ control, name: `exercises.${index}.sets` });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 }}
      className={`rounded-xl border bg-card mb-3 overflow-hidden ${isDragging ? "opacity-60 ring-2 ring-primary" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3 bg-muted/20 border-b">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground touch-none">
          <GripVertical className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm flex-1 truncate">{name}</span>
        <button
          type="button"
          onClick={() => removeExercise(index)}
          className="text-destructive/60 hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Sets */}
      <div className="px-1 py-2 space-y-0.5">
        {/* Column headers */}
        <div className="grid grid-cols-[32px_100px_1fr_1fr_32px] gap-2 px-2 mb-1">
          <div />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground text-center">Reps</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground text-center">Weight</span>
          <div />
        </div>

        {sets.map((set, setIdx) => (
          <SetRow
            key={set.id}
            index={index}
            setIdx={setIdx}
            control={control}
            register={register}
            onRemove={() => remove(setIdx)}
          />
        ))}
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => append({ order: sets.length, setType: "NORMAL", targetReps: null, targetWeight: null })}
          className="w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-dashed rounded-lg py-2 transition-colors hover:border-foreground/30"
        >
          + Add Set
        </button>
      </div>
    </div>
  );
}

// ─── Exercise Search Panel ────────────────────────────────────────────────────
function ExerciseSearchPanel({
  addedIds,
  onAdd,
}: {
  addedIds: Set<string>;
  onAdd: (ex: ExerciseResult) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 250);
  const { data: exercises, isLoading } = useExercises({ search: debouncedSearch });

  return (
    <div className="flex flex-col h-full">
      {/* Search input — always visible */}
      <div className="p-4 border-b bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            autoFocus
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results — scrolls independently */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading exercises…</p>
          </div>
        ) : !exercises || exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Dumbbell className="w-8 h-8 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">
              {search ? `No results for "${search}"` : "No exercises found"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {exercises.map((ex) => {
              const isAdded = addedIds.has(ex.id);
              return (
                <li key={ex.id}>
                  <button
                    type="button"
                    onClick={() => !isAdded && onAdd(ex)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${isAdded
                        ? "bg-primary/5 cursor-default"
                        : "hover:bg-accent cursor-pointer"
                      }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-bold uppercase text-muted-foreground">
                        {ex.name.substring(0, 2)}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ex.name}</p>
                      <p className="text-xs text-muted-foreground capitalize truncate">
                        {[ex.bodyPart, ex.equipment].filter(Boolean).join(" · ")}
                      </p>
                    </div>

                    {/* State */}
                    {isAdded ? (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export function RoutineBuilder({
  mode = "create",
  routineId,
  initialData,
  initialExerciseNames = {},
}: {
  mode?: "create" | "edit";
  routineId?: string;
  initialData?: CreateRoutineInput & { id: string };
  initialExerciseNames?: Record<string, string>;
}) {
  const router = useRouter();
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>(initialExerciseNames);
  const [mobileView, setMobileView] = useState<"builder" | "search">("builder");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateRoutineInput>({
    resolver: zodResolver(createRoutineSchema) as any,
    defaultValues: initialData || { name: "", description: "", exercises: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    if (e.over && e.active.id !== e.over.id) {
      const oldIdx = fields.findIndex((f) => f.id === e.active.id);
      const newIdx = fields.findIndex((f) => f.id === e.over!.id);
      move(oldIdx, newIdx);
    }
  };

  const addedIds = new Set(fields.map((f) => f.exerciseId));

  const handleAddExercise = useCallback((ex: ExerciseResult) => {
    setExerciseNames((prev) => ({ ...prev, [ex.id]: ex.name }));
    append({
      exerciseId: ex.id,
      order: fields.length,
      sets: [{ order: 0, setType: "NORMAL", targetReps: null, targetWeight: null }],
    });
    // On mobile, switch back to builder view after adding
    setMobileView("builder");
  }, [append, fields.length]);

  const onSubmit = async (data: CreateRoutineInput) => {
    setSubmitError(null);
    const cleaned = {
      ...data,
      exercises: data.exercises.map((ex, i) => ({
        ...ex,
        order: i,
        sets: ex.sets.map((s, si) => ({ ...s, order: si })),
      })),
    };
    try {
      if (mode === "edit" && routineId) {
        const { updateRoutine } = await import("@/app/actions/routines");
        const res = await updateRoutine(routineId, cleaned);
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createRoutine(cleaned);
        if (!res.success) throw new Error(res.error);
      }
      router.push("/routines");
    } catch (e: unknown) {
      console.error("Save routine error:", e);
      setSubmitError((e as Error)?.message || "Failed to save routine. Please try again.");
    }
  };

  // Debug: log form errors on invalid submit
  const onInvalid = (errors: FieldErrors<CreateRoutineInput>) => {
    // Changing console.error to console.warn to prevent Next.js from throwing an error overlay
    console.warn("Form validation errors:", errors);
    if (!form.getValues("name")?.trim()) {
      setSubmitError("Routine name is required.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col h-screen overflow-hidden"
      >
        {/* ─── Top Bar ─── */}
        <header className="flex items-center gap-3 px-4 py-3 border-b bg-background/95 backdrop-blur shrink-0 z-10">
          <Link href="/routines" className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <input
                    {...field}
                    placeholder="Routine name..."
                    className={`w-full bg-transparent text-lg font-bold placeholder:text-muted-foreground/50 focus:outline-none ${
                      fieldState.error ? "placeholder:text-destructive/60 text-destructive" : ""
                    }`}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </header>

        {/* Error bar — shows below header, full width */}
        {submitError && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {submitError}
          </div>
        )}

        {/* ─── Mobile Tab Bar ─── */}
        <div className="flex md:hidden shrink-0 border-b bg-background">
          <button
            type="button"
            onClick={() => setMobileView("builder")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              mobileView === "builder"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Routine ({fields.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileView("search")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              mobileView === "search"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Add Exercises
          </button>
        </div>

        {/* ─── Main Content ─── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT: Builder — hides on mobile when search tab active */}
          <div className={`
            flex flex-col w-full md:w-[55%] md:border-r overflow-hidden
            ${mobileView === "search" ? "hidden md:flex" : "flex"}
          `}>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Optional description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <input
                        {...field}
                        value={field.value || ""}
                        placeholder="Notes (optional)"
                        className="w-full bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none border-b border-border pb-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Exercise list */}
              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Dumbbell className="w-10 h-10 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground text-sm text-center">
                    Search for exercises on the right<br />and tap + to add them here
                  </p>
                  {/* Mobile CTA */}
                  <button
                    type="button"
                    onClick={() => setMobileView("search")}
                    className="md:hidden mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                  >
                    Browse Exercises
                  </button>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    {fields.map((field, index) => (
                      <ExerciseCard
                        key={field.id}
                        id={field.id}
                        index={index}
                        control={form.control}
                        register={form.register}
                        removeExercise={remove}
                        name={exerciseNames[field.exerciseId] || "Exercise"}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {/* RIGHT: Exercise Search — always visible on desktop, tab on mobile */}
          <div className={`
            flex flex-col w-full md:w-[45%] overflow-hidden bg-background
            ${mobileView === "builder" ? "hidden md:flex" : "flex"}
          `}>
            <ExerciseSearchPanel addedIds={addedIds} onAdd={handleAddExercise} />
          </div>

        </div>
      </form>
    </Form>
  );
}
