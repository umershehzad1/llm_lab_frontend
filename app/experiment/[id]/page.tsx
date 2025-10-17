'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getExperiment } from '@/lib/api'
import ComparisonChart from '@/components/ComparisonChart'
import { formatDate } from '../../../utils/formatters'

export default function ExperimentDetail() {
  const params = useParams()
  const id = Number(params?.id)
  const [exp, setExp] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    getExperiment(id).then((res) => setExp(res.data))
  }, [id])

  if (!exp) return <div className="p-10 text-center text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-100 text-gray-900 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md border border-gray-200 p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Experiment #{exp.id}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          {formatDate(exp.createdAt)}
        </p>

        <div className="mb-6">
          <h2 className="font-medium text-gray-700 mb-1">Prompt</h2>
          <p className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-700 whitespace-pre-line">
            {exp.prompt}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-medium text-gray-700 mb-1">Response</h2>
          <p className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800 whitespace-pre-line">
            {exp.response}
          </p>
        </div>

        <div>
          <h2 className="font-medium text-gray-700 mb-3">Metrics</h2>
          <ComparisonChart metrics={exp.metrics} />
        </div>
      </div>
    </div>
  )
}
