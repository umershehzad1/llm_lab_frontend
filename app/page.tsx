'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, Send, Settings, ChevronDown, Sliders, SlidersHorizontal, SlidersIcon, ArrowUp } from 'lucide-react'
import { getExperiments } from '@/lib/api'
import ExportButton from '@/components/ExportButton'
import { useChatStore } from '@/store/useExperimentStore'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showParams, setShowParams] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(0.9)
  const { experiments, setExperiments, addExperiment } = useChatStore()
  const [messages, setMessages] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])


  useEffect(() => {
    getExperiments().then((res) => setExperiments(res.data))
  }, [setExperiments])

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
        body: JSON.stringify({
          prompt: currentPrompt,
          temperature,
          topP,
          model: selectedModel,
        }),
      })

      if (!res.body) throw new Error('No stream received')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        let lines = buffer.split('\n\n')

        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: end')) continue
          if (line.startsWith('data:')) {
            const content = line.replace(/^data:\s*/, '')
            if (content === '[DONE]') continue
            if (!content.trim()) continue

            await new Promise((r) => setTimeout(r, 50))

            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]

              const newText = content
              if (!last.content.endsWith(newText)) {
                const separator =
                  last.content.endsWith(' ') || newText.startsWith(' ') ? '' : ' '
                last.content += separator + newText
              }

              return updated
            })

          }
        }
      }

      if (buffer.trim().startsWith('data:')) {
        const content = buffer.replace(/^data:\s*/, '')
        if (content && content !== '[DONE]') {
          await new Promise((r) => setTimeout(r, 50))

          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]

            const newText = content
            if (!last.content.endsWith(newText)) {
              const separator =
                last.content.endsWith(' ') || newText.startsWith(' ') ? '' : ' '
              last.content += separator + newText
            }

            return updated
          })

        }
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <main className="relative w-full h-screen bg-[#0f0f0f] text-gray-100 flex overflow-hidden">
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#1a1a1a] border-r border-gray-800 p-4 flex flex-col z-40 transition-transform duration-300 transform ${showHistory ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-200">Chatbot History</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
          {experiments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-6">
              No conversations yet
            </p>
          ) : (
            experiments.map((exp) => (
              <div
                key={exp.id}
                onClick={() => {
                  window.location.href = `/experiment/${exp.id}`
                  setShowHistory(false)
                }}
                className="p-3 bg-[#222] rounded-lg hover:bg-[#2e2e2e] border border-gray-700 cursor-pointer transition-all"
              >
                <p className="text-sm text-gray-200 truncate">
                  {exp.prompt.slice(0, 60)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Temp {exp.temperature} • TopP {exp.topP}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>

      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}

      <section
        className={`flex flex-col w-full transition-all duration-300 ${showHistory ? 'md:ml-72' : 'ml-0'
          }`}
      >
        <header className="flex items-center justify-between px-6 py-3 sticky top-0 z-10">
          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-[#2a2a2a]"
            title="History"
          >
            <SlidersHorizontal size={18} className="text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowParams(!showParams)}
              className="p-2 gap-2 rounded-lg hover:bg-[#2a2a2a] row-gap-1 flex items-center"
              title="Parameters"
            >
              Change the params<Settings size={18} className="text-gray-400" />
            </button>
            <ExportButton
              data={experiments}
              iconOnly
              className="p-2 rounded-lg hover:bg-[#2a2a2a]"
            />
          </div>
        </header>

        {showParams && (
          <>
            <div
              onClick={() => setShowParams(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            <div
              className="fixed top-16 right-4 w-64 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl p-4 
    z-50 flex flex-col gap-4 animate-slide-in"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300">Parameters</h3>
              </div>

              {/* Temperature */}
              <div className="flex flex-col text-sm">
                <label className="text-gray-400 mb-1">Temperature</label>
                <select
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-indigo-500
                 px-3 py-2 appearance-none cursor-pointer pr-8"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg fill=\'none\' stroke=\'%23aaa\' stroke-width=\'2\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.7rem center',
                    backgroundSize: '1rem',
                  }}
                >
                  {[0.1, 0.3, 0.5, 0.7, 0.9, 1].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Top-P */}
              <div className="flex flex-col text-sm">
                <label className="text-gray-400 mb-1">Top-P</label>
                <select
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-indigo-500
                 px-3 py-2 appearance-none cursor-pointer pr-8"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg fill=\'none\' stroke=\'%23aaa\' stroke-width=\'2\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.7rem center',
                    backgroundSize: '1rem',
                  }}
                >
                  {[0.1, 0.3, 0.5, 0.7, 0.9, 1].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </>
        )}


        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#0f0f0f]">
          {messages.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-3xl">
              {/* Start a new conversation by typing a prompt below. */}
              Welcome Back
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
                    className={`max-w-2xl px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-[#1a1a1a] border border-gray-700 text-gray-100 rounded-bl-none'
                      }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-gray-700 text-gray-400 px-3 py-2 rounded-2xl text-sm animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />

            </div>
          )}
        </div>


        <footer className="px-4 py-3 sticky bottom-3">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">

            <div className="flex-1 flex items-center gap-2 bg-[#2a2a2a] rounded-full px-4 py-2 border border-gray-700 focus-within:border-indigo-500">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#2a2a2a] text-sm text-white border-none outline-none cursor-pointer pr-2"
              >
                <option value="gpt-4o-mini">GPT-4o-mini</option>
                <option value="gpt-4.1">GPT-4.1</option>
                <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
              </select>

              <textarea
                placeholder="Send a message..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())
                }
                className="flex-1 bg-transparent resize-none border-none outline-none text-white placeholder-gray-400 py-1 text-sm leading-relaxed"
                rows={1}
                style={{ maxHeight: '100px' }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              title="Send"
            >
              {loading ? (
                <div className="animate-spin border-2 border-white/50 border-t-transparent rounded-full w-5 h-5" />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </div>
        </footer>
      </section>
    </main>
  )
}
