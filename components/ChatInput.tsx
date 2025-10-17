'use client'
import { useState } from 'react'
import { useChatStore } from '@/store/useChatStore'

export default function ChatInput() {
  const [input, setInput] = useState('')
  const { addMessage, messages, temperature, model } = useChatStore()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    addMessage(userMsg)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMsg], temperature, model }),
    })
    const data = await res.json()
    addMessage({ role: 'assistant', content: data.reply })
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-3 backdrop-blur-md bg-gray-900/80"
    >
      <input
        className="flex-1 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500 transition-all duration-150"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-5 py-2 rounded-lg font-medium text-sm text-white shadow-md transition-all duration-200 ${
          loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90'
        }`}
      >
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </form>
  )
}
