import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "@prisma/client";

interface UseExercisesParams {
  search?: string;
  bodyPart?: string;
  target?: string;
}

export function useExercises(params?: UseExercisesParams) {
  return useQuery({
    queryKey: ["exercises", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.bodyPart) searchParams.set("bodyPart", params.bodyPart);
      if (params?.target) searchParams.set("target", params.target);

      const url = `/api/exercises${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }
      return response.json() as Promise<Exercise[]>;
    },
  });
}
