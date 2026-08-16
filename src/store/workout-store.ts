import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SetType = 'NORMAL' | 'WARMUP' | 'DROPSET' | 'FAILURE';

export interface ActiveWorkoutSet {
  id: string;
  order: number;
  setType: SetType;
  reps: number | null;
  weight: number | null;
  isCompleted: boolean;
}

export interface ActiveWorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  bodyPart: string | null;
  target: string | null;
  equipment: string | null;
  category: string | null;
  order: number;
  restSeconds: number | null;
  sets: ActiveWorkoutSet[];
}

export interface WorkoutState {
  isActive: boolean;
  startTime: number | null;
  routineId: string | null;
  title: string;
  exercises: ActiveWorkoutExercise[];
  restTimer: {
    isActive: boolean;
    durationSec: number;
    startTime: number;
  } | null;

  startWorkout: (routineId: string | null, title: string, exercises?: ActiveWorkoutExercise[]) => void;
  endWorkout: () => void;
  
  addExercise: (exercise: Omit<ActiveWorkoutExercise, 'id' | 'order' | 'sets'>) => void;
  removeExercise: (id: string) => void;
  replaceExercise: (oldId: string, newExercise: Omit<ActiveWorkoutExercise, 'id' | 'order' | 'sets'>) => void;
  reorderExercises: (oldIndex: number, newIndex: number) => void;
  
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<ActiveWorkoutSet>) => void;
  toggleSetComplete: (exerciseId: string, setId: string, restSecs?: number | null) => void;
  
  startRestTimer: (durationSec: number) => void;
  clearRestTimer: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      isActive: false,
      startTime: null,
      routineId: null,
      title: 'Quick Workout',
      exercises: [],
      restTimer: null,

      startWorkout: (routineId, title, exercises = []) => set({
        isActive: true,
        startTime: Date.now(),
        routineId,
        title,
        exercises,
        restTimer: null,
      }),

      endWorkout: () => set({
        isActive: false,
        startTime: null,
        routineId: null,
        title: 'Quick Workout',
        exercises: [],
        restTimer: null,
      }),

      addExercise: (exercise) => set((state) => ({
        exercises: [
          ...state.exercises,
          {
            ...exercise,
            id: generateId(),
            order: state.exercises.length,
            restSeconds: null,
            sets: [
              {
                id: generateId(),
                order: 0,
                setType: 'NORMAL',
                reps: null,
                weight: null,
                isCompleted: false,
              }
            ],
          }
        ]
      })),

      removeExercise: (id) => set((state) => ({
        exercises: state.exercises.filter((ex) => ex.id !== id).map((ex, index) => ({
          ...ex,
          order: index,
        }))
      })),

      replaceExercise: (oldId, newExercise) => set((state) => {
        const index = state.exercises.findIndex(ex => ex.id === oldId);
        if (index === -1) return state;
        
        const newExercises = [...state.exercises];
        newExercises[index] = {
          ...newExercise,
          id: generateId(),
          order: index,
          restSeconds: null,
          sets: [
            {
              id: generateId(),
              order: 0,
              setType: 'NORMAL',
              reps: null,
              weight: null,
              isCompleted: false,
            }
          ],
        };
        
        return { exercises: newExercises };
      }),

      reorderExercises: (oldIndex, newIndex) => set((state) => {
        const exercises = [...state.exercises];
        const [moved] = exercises.splice(oldIndex, 1);
        if (moved) {
          exercises.splice(newIndex, 0, moved);
        }
        return {
          exercises: exercises.map((ex, idx) => ({ ...ex, order: idx }))
        };
      }),

      addSet: (exerciseId) => set((state) => {
        return {
          exercises: state.exercises.map(ex => {
            if (ex.id === exerciseId) {
              const lastSet = ex.sets[ex.sets.length - 1];
              return {
                ...ex,
                sets: [
                  ...ex.sets,
                  {
                    id: generateId(),
                    order: ex.sets.length,
                    setType: 'NORMAL',
                    reps: lastSet ? lastSet.reps : null,
                    weight: lastSet ? lastSet.weight : null,
                    isCompleted: false,
                  }
                ]
              };
            }
            return ex;
          })
        };
      }),

      removeSet: (exerciseId, setId) => set((state) => ({
        exercises: state.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.filter(s => s.id !== setId).map((s, idx) => ({ ...s, order: idx }))
            };
          }
          return ex;
        })
      })),

      updateSet: (exerciseId, setId, data) => set((state) => ({
        exercises: state.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(s => s.id === setId ? { ...s, ...data } : s)
            };
          }
          return ex;
        })
      })),

      toggleSetComplete: (exerciseId, setId, restSecs) => set((state) => {
        let timer = state.restTimer;
        
        const newExercises = state.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(s => {
                if (s.id === setId) {
                  const isCompleted = !s.isCompleted;
                  // Only start timer if completing the set and there is a rest duration
                  if (isCompleted && (restSecs || ex.restSeconds)) {
                    timer = {
                      isActive: true,
                      durationSec: restSecs || ex.restSeconds || 90,
                      startTime: Date.now()
                    };
                  }
                  return { ...s, isCompleted };
                }
                return s;
              })
            };
          }
          return ex;
        });

        return {
          exercises: newExercises,
          restTimer: timer
        };
      }),

      startRestTimer: (durationSec) => set({
        restTimer: {
          isActive: true,
          durationSec,
          startTime: Date.now()
        }
      }),

      clearRestTimer: () => set({
        restTimer: null
      }),
    }),
    {
      name: 'hevy-workout-storage', // key in localStorage
    }
  )
);
