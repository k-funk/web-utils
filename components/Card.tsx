import styles from './Card.module.css'

interface Props {
  label: string
  sublabel?: string
  value: string
  detail?: string
}

export default function Card({ label, sublabel, value, detail }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      {sublabel && <div className={styles.sublabel}>{sublabel}</div>}
      <div className={styles.value}>{value}</div>
      {detail && <div className={styles.detail}>{detail}</div>}
    </div>
  )
}
