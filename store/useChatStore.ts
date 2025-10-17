import { create } from 'zustand'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  messages: Message[]
  temperature: number
  model: string
  addMessage: (msg: Message) => void
  clearChat: () => void
  setTemperature: (t: number) => void
  setModel: (m: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  temperature: 0.7,
  model: 'gpt-4o-mini',
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearChat: () => set({ messages: [] }),
  setTemperature: (t) => set({ temperature: t }),
  setModel: (m) => set({ model: m }),
}))
