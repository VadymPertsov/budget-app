import cn from 'classnames'
import { InputHTMLAttributes } from 'react'

import styles from './styles.module.scss'

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  type?: 'text' | 'number'
  onChange: (value: string | number) => void
}

export const Input = (props: InputProps) => {
  const { label, type = 'text', onChange, value, className, ...rest } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue =
      type === 'number' ? Number(event.target.value) : event.target.value
    onChange(inputValue)
  }

  return (
    <div className={styles.root}>
      {label && <p className={styles.label}>{label}</p>}
      <input
        type={type}
        className={cn(styles.input, className)}
        onChange={handleChange}
        value={value}
        {...rest}
      />
    </div>
  )
}
