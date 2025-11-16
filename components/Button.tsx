import React from 'react'
import styles from './Button.module.css'

interface Props {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export default function Button({ children, type = 'button', onClick }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={styles.button}
    >
      {children}
    </button>
  )
}
