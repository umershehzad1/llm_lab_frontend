'use client'

import { useState, useEffect } from 'react'
import { generateLLM, getExperiments } from '@/lib/api'
import { useChatStore } from '@/store/useExperimentStore'
import ParameterControls from '@/components/ParameterControls'
import { Clock, Send, Settings } from 'lucide-react'
import ExportButton from '@/components/ExportButton'
import { motion } from 'framer-motion'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showParams, setShowParams] = useState(false)
  const { experiments, setExperiments, addExperiment } = useChatStore()
  const [messages, setMessages] = useState<any[]>([])
  const [params, setParams] = useState({ temperature: 0.7, topP: 0.9 })

  useEffect(() => {
    getExperiments().then((res) => setExperiments(res.data))
  }, [setExperiments])

  // const handleGenerate = async () => {
  //   if (!prompt.trim()) return
  //   const userMsg = { role: 'user', content: prompt }
  //   setMessages((prev) => [...prev, userMsg])
  //   const currentPrompt = prompt
  //   setPrompt('')

  //   try {
  //     setLoading(true)
  //     const res = await generateLLM({ prompt: currentPrompt, ...params })
  //     const aiMsg = { role: 'assistant', content: res.data.response }
  //     setMessages((prev) => [...prev, aiMsg])
  //     addExperiment(res.data)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    const userMsg = { role: 'user', content: prompt }
    setMessages((prev) => [...prev, userMsg])
    const currentPrompt = prompt
    setPrompt('')
    setLoading(true)

    const aiMsg = { role: 'assistant', content: '' }
    setMessages((prev) => [...prev, aiMsg])

    try {
      const res = await fetch('http://localhost:5000/llm/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, ...params }),
      })

      if (!res.body) throw new Error('No stream received')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const match = chunk.match(/data: (.*)/g)
        if (match) {
          for (const line of match) {
            const content = line.replace('data: ', '')
            if (content === '[DONE]') continue
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              last.content += content
              return updated
            })
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }



  return (
    <main className="relative w-full h-screen bg-gray-50 text-gray-900 overflow-hidden flex">
      {/* Sidebar (History) */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 p-4 flex flex-col z-40 transition-transform duration-300 ease-in-out transform ${showHistory ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">🧾 History</h2>
          <button
            onClick={() => setShowHistory(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {experiments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-4">No experiments yet</p>
          ) : (
            experiments.map((exp) => (
              <div
                key={exp.id}
                onClick={() => {
                  window.location.href = `/experiment/${exp.id}`
                  setShowHistory(false)
                }}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-indigo-50 cursor-pointer transition-all"
              >
                <p className="text-sm text-gray-800 font-medium truncate">
                  {exp.prompt.slice(0, 50)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Temp {exp.temperature} • TopP {exp.topP}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        ></div>
      )}

      {/* Main chat area */}
      <section
        className={`flex flex-col transition-all duration-300 ease-in-out ${showHistory ? 'md:ml-72' : 'ml-0'
          } w-full`}
      >
        {/* Header */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">LLM Lab Console</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowParams(!showParams)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              title="Parameters"
            >
              <Settings size={18} className="text-gray-600" />
            </button>
            <ExportButton
              data={experiments}
              iconOnly
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            />
            <button
              onClick={() => setShowHistory((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              title="History"
            >
              <Clock size={18} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-50">
          {messages.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-center text-sm">
              <p>👋 Enter a prompt below to start your first experiment.</p>
            </div>
          ) : (
            <div className="space-y-4 pb-24">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`max-w-lg p-3 rounded-2xl shadow-sm text-sm ${msg.role === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && messages[messages.length - 1]?.role === 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-2xl text-sm shadow-sm animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Input area fixed to bottom */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0">
          {showParams && (
            <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <ParameterControls params={params} setParams={setParams} />
            </div>
          )}

          <div className="flex gap-2 items-end">
            <textarea
              placeholder="Type your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())
              }
              className="flex-1 resize-none h-14 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-gray-800"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`p-5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:opacity-90 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {loading ? (
                <div className="animate-spin border-2 border-white/50 border-t-transparent rounded-full w-5 h-5" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </footer>
      </section>
    </main>
  )
}
