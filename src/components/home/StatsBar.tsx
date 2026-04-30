import { useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Users, Star, Truck, RefreshCw } from 'lucide-react'

const stats = [
  { icon: Users, value: 50000, suffix: '+', label: 'Happy Customers', color: 'text-blue-400' },
  { icon: Star, value: 4.9, label: 'Average Rating', isFloat: true, color: 'text-amber-400' },
  { icon: Truck, value: 50, prefix: '$', label: 'Free Shipping & Above', color: 'text-emerald-400' },
  { icon: RefreshCw, value: 30, suffix: '-day', label: 'Free Returns', color: 'text-violet-400' },
]

const AnimatedNumber = ({ value, isFloat, prefix = '', suffix = '' }: {
  value: number; isFloat?: boolean; prefix?: string; suffix?: string
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 50, damping: 15 })
  const display = useTransform(spring, v => {
    const formatted = isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString()
    return `${prefix}${formatted}${suffix}`
  })

  if (isInView) motionVal.set(value)

  return <motion.span ref={ref}>{display}</motion.span>
}

export const StatsBar = () => (
  <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, value, suffix, prefix, label, isFloat, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="card p-5 text-center"
        >
          <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
          <div className={`text-2xl md:text-3xl font-bold tabular-nums ${color}`}>
            <AnimatedNumber value={value} isFloat={isFloat} prefix={prefix} suffix={suffix} />
          </div>
          <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">{label}</p>
        </motion.div>
      ))}
    </div>
  </section>
)
