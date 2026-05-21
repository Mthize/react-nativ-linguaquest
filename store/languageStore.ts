import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { isLanguageAvailable } from "@/data/languages";
import { LanguageCode } from "@/types/learning";

interface LanguageState {
  selectedLanguage: LanguageCode | null;
  setSelectedLanguage: (code: LanguageCode) => void;
  clearSelectedLanguage: () => void;
}

const normalizeSelectedLanguage = (code: LanguageCode | null | undefined) =>
  code && isLanguageAvailable(code) ? code : null;

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      setSelectedLanguage: (code) =>
        set({ selectedLanguage: normalizeSelectedLanguage(code) }),
      clearSelectedLanguage: () => set({ selectedLanguage: null }),
    }),
    {
      name: "languageStorage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return { selectedLanguage: null } as LanguageState;
        }

        return {
          ...(persistedState as LanguageState),
          selectedLanguage: normalizeSelectedLanguage(
            (persistedState as LanguageState).selectedLanguage
          ),
        };
      },
    },
  ),
);
