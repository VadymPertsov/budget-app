import cn from 'classnames'

import styles from './styles.module.scss'

interface SelectProps<T> {
  label?: string
  placeholder?: string
  options: T[]
  onChange: (value: T) => void
  value: T
  className?: string
}

export const Select = <T extends string | number>({
  label,
  placeholder,
  options,
  onChange,
  value,
  className,
}: SelectProps<T>) => {
  return (
    <div className={cn(styles.root, className)}>
      {label && <p className={styles.label}>{label}</p>}
      <select
        className={styles.select}
        onChange={e => onChange(e.target.value as T)}
        value={value}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.sort().map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
