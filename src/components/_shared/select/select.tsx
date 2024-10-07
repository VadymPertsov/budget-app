import styles from './styles.module.scss'

interface SelectProps {
  label?: string
  placeholder: string
  options: string[]
  onChange: (value: string) => void
  value: string
}

export const Select = (props: SelectProps) => {
  const { label, placeholder, options, onChange, value } = props

  return (
    <div className={styles.root}>
      {label && <p className={styles.label}>{label}</p>}
      <select onChange={e => onChange(e.target.value)} value={value}>
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
