import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import AuthButton from './AuthButton';
import styles from './Navbar.module.css';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◮</span> AquaVerse
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/catalog/fish" className={styles.link}>Fish</Link>
          <Link href="/catalog/plants" className={styles.link}>Plants</Link>
          <Link href="/catalog/invertebrates" className={styles.link}>Invertebrates</Link>
          <Link href="/catalog/aquascapes" className={styles.link}>Aquascapes</Link>
          <Link href="/guides" className={styles.link}>Guides</Link>
          {user && (
            <>
              <Link href="/wishlist" className={styles.link} style={{ color: 'var(--accent-teal)' }}>
                My Wishlist
              </Link>
              <Link href="/admin" className={styles.link} style={{ color: 'var(--accent-gold)' }}>
                Admin
              </Link>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.searchBtn} aria-label="Search">
            🔍
          </button>
          <AuthButton userEmail={user?.email} />
        </div>
      </div>
    </nav>
  );
}
