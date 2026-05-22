import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LearningState {
  xpToday: number;
  dailyGoal: number;
  streak: number;
  completedLessonIds: string[];
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      xpToday: 15,
      dailyGoal: 20,
      streak: 12,
      completedLessonIds: [],
      addXP: (amount) =>
        set((state) => {
          const clampedAmount = Math.max(amount, 0);

          return {
            xpToday: Math.min(
              Math.max(state.xpToday + clampedAmount, 0),
              state.dailyGoal
            ),
          };
        }),
      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
        })),
    }),
    {
      name: "learning-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
