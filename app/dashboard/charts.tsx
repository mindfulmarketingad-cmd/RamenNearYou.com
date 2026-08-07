'use client'

import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

const AXIS = { fontSize: 11, fill: '#6B6862' }
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid rgba(0,0,0,0.08)',
  fontSize: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export function ActionBreakdownChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-[#6B6862] py-12 text-center">No events in this range yet.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="rgba(0,0,0,0.06)" />
        <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="label" tick={AXIS} axisLine={false} tickLine={false} width={104} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(181,127,80,0.06)' }} />
        <Bar dataKey="value" name="Events" fill="#B57F50" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DailyTrendChart({ data }: { data: { date: string; pageviews: number; leadActions: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-[#6B6862] py-12 text-center">No events in this range yet.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
        <CartesianGrid stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="date"
          tick={AXIS}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
          tickFormatter={(d: string) => d.slice(5)}
        />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} width={36} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="pageviews" name="Views" stroke="#B57F50" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="leadActions" name="Lead actions" stroke="#16a34a" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
