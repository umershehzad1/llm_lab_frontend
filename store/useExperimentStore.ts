import { create } from 'zustand'

interface Experiment {
  id: number
  prompt: string
  temperature: number
  topP: number
  response: string
  metrics: Record<string, any>
  createdAt: string
}

interface ExperimentState {
  experiments: Experiment[]
  setExperiments: (data: Experiment[]) => void
  addExperiment: (exp: Experiment) => void
  clearExperiments: () => void
}

export const useChatStore = create<ExperimentState>((set) => ({
  experiments: [],
  setExperiments: (data) => set({ experiments: data }),
  addExperiment: (exp) =>
    set((state) => ({ experiments: [exp, ...state.experiments] })),
  clearExperiments: () => set({ experiments: [] }),
}))
