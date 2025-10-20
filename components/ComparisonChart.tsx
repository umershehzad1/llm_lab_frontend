'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export default function ComparisonChart({ metrics }: { metrics: any }) {
  const data = Object.keys(metrics).map((k) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    value: metrics[k],
  }))

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={28}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2a2a2a"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: '#aaa', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
            tickLine={{ stroke: '#333' }}
          />
          <YAxis
            tick={{ fill: '#777', fontSize: 11 }}
            axisLine={{ stroke: '#333' }}
            tickLine={{ stroke: '#333' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
              boxShadow: '0 0 10px rgba(0,0,0,0.4)',
            }}
            labelStyle={{ color: '#aaa', marginBottom: 4 }}
          />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            animationDuration={600}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
