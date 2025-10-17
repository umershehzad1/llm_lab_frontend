'use client'
import { useChatStore } from '@/store/useChatStore'

export default function SettingsPanel() {
  const { model, setModel, temperature, setTemperature, clearChat } = useChatStore()

  return (
    <div className="flex items-center justify-between px-6 py-3 text-sm">
      <div className="flex items-center gap-4">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer"
          />
          <span className="text-gray-400">Temp: {temperature}</span>
        </div>
      </div>

      <button
        onClick={clearChat}
        className="text-red-400 hover:text-red-300 transition-colors duration-150"
      >
        Clear
      </button>
    </div>
  )
}
