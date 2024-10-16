import { CurrentCurrency } from '@components/_shared/current-currency'
import {
  PieChart as PieChartItem,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import styles from './styles.module.scss'

interface PieChartProps {
  title?: string
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export const PieChart = (props: PieChartProps) => {
  const { data, title } = props

  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className={styles.root}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChartItem width={200} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip total={total} />} />
        </PieChartItem>
      </ResponsiveContainer>
    </div>
  )
}

interface CustomTooltipProps {
  payload?: Array<{ payload: PieChartProps['data'][0] }>
  active?: boolean
  total: number
}

const CustomTooltip = ({ active, payload, total }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, color, value } = payload[0].payload
    const percentage = ((value / total) * 100).toFixed(2)

    return (
      <div
        className={styles.tooltip}
        style={{
          backgroundColor: hexToRgba('#00000', 0.5),
          border: `5px solid ${color}`,
        }}
      >
        <p className={styles.label}>{name}:</p>
        <CurrentCurrency className={styles.label} value={value} />
        <span className={styles.label}>{`(${percentage}%)`}</span>
      </div>
    )
  }

  return null
}

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
