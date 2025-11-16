import React from 'react'
import styles from './FormInput.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}

export default function FormInput({ value, onChange, placeholder, type = 'text' }: Props) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={styles.input}
    />
  )
}