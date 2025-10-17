'use client'
interface Props {
  params: { temperature: number; topP: number }
  setParams: (p: { temperature: number; topP: number }) => void
}

export default function ParameterControls({ params, setParams }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white shadow-sm border border-gray-200 p-4 rounded-xl">
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="text-sm text-gray-600 mb-1">
          Temperature ({params.temperature})
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={params.temperature}
          onChange={(e) =>
            setParams({ ...params, temperature: Number(e.target.value) })
          }
          className="accent-indigo-500"
        />
      </div>

      <div className="flex flex-col w-full sm:w-1/2">
        <label className="text-sm text-gray-600 mb-1">
          Top P ({params.topP})
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={params.topP}
          onChange={(e) =>
            setParams({ ...params, topP: Number(e.target.value) })
          }
          className="accent-purple-500"
        />
      </div>
    </div>
  )
}
