import Link from 'next/link';
import styles from './landing.module.css';
export default function Home() {
  return (
    <main className={styles.hero}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Welcome to Gepo</p>
        <h1 className={styles.title}>GitHub Analyzer</h1>
        <p className={styles.description}>
          Analyze your GitHub profile with personalized insights.
        </p>
        <div className={styles.ctaRow}>
          <Link className={styles.primary} href="/auth/login">Get Started</Link>
        </div>
      </div>
    </main>
  )
}