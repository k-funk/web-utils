import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/Nav.module.css'

const links = [
  { href: '/', label: 'Promerica .xls to .csv' },
  { href: '/promerica-fbar', label: 'Promerica FBAR' },
]

export default function Nav() {
  const { pathname } = useRouter()

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href}>
              <a className={`${styles.link} ${pathname === href ? styles.active : ''}`}>
                {label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
