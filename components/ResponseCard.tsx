'use client'
import Link from 'next/link'
import { formatDate } from '../utils/formatters'
import ComparisonChart from './ComparisonChart'

export default function ResponseCard({ data }: { data: any }) {
  const { id, temperature, topP, response, metrics, createdAt } = data

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800 text-sm">
            Temp {temperature} • Top P {topP}
          </h3>
          <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-4">
          {response}
        </p>

        <ComparisonChart metrics={metrics} />
      </div>

      <Link
        href={`/experiment/${id}`}
        className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        View Details →
      </Link>
    </div>
  )
}
