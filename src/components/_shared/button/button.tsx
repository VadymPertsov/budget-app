import cn from 'classnames'
import { ButtonHTMLAttributes } from 'react'

import styles from './styles.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  isActive?: boolean
}

export const Button = (props: ButtonProps) => {
  const { onClick, text, disabled, isActive } = props

  return (
    <button
      onClick={onClick}
      className={cn(styles.root, {
        [styles.active]: isActive,
      })}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
