'use client'
interface Props {
  prompt: string
  setPrompt: (v: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function PromptInput({ prompt, setPrompt, onSubmit, loading }: Props) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your creative or analytical prompt..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <button
        onClick={onSubmit}
        disabled={loading || !prompt.trim()}
        className={`mt-3 w-full sm:w-auto px-6 py-2 text-white rounded-lg transition-all shadow-md ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90'
        }`}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </div>
  )
}
