'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store/useExperimentStore'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function HistoryPanel({ isOpen, onClose }: Props) {
  const { experiments } = useChatStore()
  const router = useRouter()

  const handleSelectExperiment = (id: number) => {
    onClose()
    setTimeout(() => router.push(`/experiment/${id}`), 250)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-in Sidebar (from left) */}
          <motion.aside
            className="fixed left-0 top-0 h-full w-80 sm:w-96 bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 p-5 flex flex-col border-r border-gray-200"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                🧾 History
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {experiments.length === 0 ? (
              <p className="text-gray-400 text-sm mt-6 text-center">
                No experiments yet. Generate one to start your history.
              </p>
            ) : (
              <ul className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {experiments.map((exp) => (
                  <li
                    key={exp.id}
                    onClick={() => handleSelectExperiment(exp.id)}
                    className="p-3 bg-white/70 border border-gray-200 rounded-lg hover:bg-indigo-50 transition-all cursor-pointer group"
                  >
                    <p className="text-sm text-gray-800 font-medium truncate group-hover:text-indigo-600">
                      {exp.prompt.slice(0, 50)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Temp {exp.temperature} • TopP {exp.topP}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} LLM Lab
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
