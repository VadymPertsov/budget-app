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

  return (
    <div className={styles.root}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <ResponsiveContainer width="100%" height={200}>
        <PieChartItem width={200} height={200}>
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
          <Tooltip />
        </PieChartItem>
      </ResponsiveContainer>
    </div>
  )
}
