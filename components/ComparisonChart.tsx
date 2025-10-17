'use client'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ComparisonChart({ metrics }: { metrics: any }) {
  const data = Object.keys(metrics).map((k) => ({
    name: k,
    value: metrics[k],
  }))

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
