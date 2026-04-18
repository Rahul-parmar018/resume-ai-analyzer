import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useResumeStore = create(
  persist(
    (set) => ({
      // Shared Data
      resumeFile: null,
      resumeText: "",
      scanResult: null,
      gapResult: null,
      optimizerResult: null,

      // Actions
      setScanResult: (result) => set({ scanResult: result, resumeText: result.extracted_text || "" }),
      setGapResult: (result) => set({ gapResult: result }),
      setOptimizerResult: (result) => set({ optimizerResult: result }),
      setResumeText: (text) => set({ resumeText: text }),
      
      // Full Reset
      resetAll: () => set({
        resumeFile: null,
        resumeText: "",
        scanResult: null,
        gapResult: null,
        optimizerResult: null,
      }),
    }),
    {
      name: 'candidex-resume-storage', // local storage key
    }
  )
);
