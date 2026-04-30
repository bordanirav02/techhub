import { useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/lib/formatters'
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

export default function Analytics() {
  const { orders } = useAuthStore()

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.total, 0)
    const count = orders.length
    const avg = count > 0 ? total / count : 0

    const monthlyData = orders.reduce<Record<string, number>>((acc, o) => {
      const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + o.total
      return acc
    }, {})

    const categoryData = orders.flatMap(o => o.items).reduce<Record<string, number>>((acc, item) => {
      const cat = item.product.category
      acc[cat] = (acc[cat] || 0) + item.unitPrice * item.quantity
      return acc
    }, {})

    const brandData = orders.flatMap(o => o.items).reduce<Record<string, number>>((acc, item) => {
      acc[item.product.brand] = (acc[item.product.brand] || 0) + item.unitPrice * item.quantity
      return acc
    }, {})

    return {
      total, count, avg,
      monthly: Object.entries(monthlyData).map(([name, value]) => ({ name, value: Math.round(value) })),
      categories: Object.entries(categoryData).map(([name, value]) => ({ name, value: Math.round(value) })),
      brands: Object.entries(brandData)
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
    }
  }, [orders])

  const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
      <p className="text-sm text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
    </div>
  )

  const customTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 text-sm shadow-xl">
          <p className="text-[var(--text-muted)] mb-1">{label}</p>
          <p className="font-bold text-[var(--text-primary)]">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (orders.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No data yet</h2>
        <p className="text-[var(--text-muted)]">Place some orders to see your spending analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)]">Spending Analytics</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Spent" value={formatCurrency(stats.total)} />
        <StatCard label="Total Orders" value={stats.count.toString()} />
        <StatCard label="Avg. Order Value" value={formatCurrency(stats.avg)} />
      </div>

      {/* Monthly area chart */}
      {stats.monthly.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Spending Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.monthly}>
              <defs>
                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorBlue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category pie */}
        {stats.categories.length > 0 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.categories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }) => name}>
                  {stats.categories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Brand bar chart */}
        {stats.brands.length > 0 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Top Brands</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.brands} layout="vertical">
                <XAxis type="number" stroke="var(--text-muted)" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} width={60} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {stats.brands.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
