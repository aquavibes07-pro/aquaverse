import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <h2>◮ AquaVerse</h2>
          <p>Your premium encyclopedia for fish keeping and aquascaping. Discover, learn, and build your dream aquatic ecosystem.</p>
        </div>
        
        <div className={styles.col}>
          <h3>Catalog</h3>
          <div className={styles.links}>
            <Link href="/catalog/fish" className={styles.link}>Freshwater Fish</Link>
            <Link href="/catalog/plants" className={styles.link}>Aquatic Plants</Link>
            <Link href="/catalog/invertebrates" className={styles.link}>Invertebrates</Link>
            <Link href="/catalog/aquascapes" className={styles.link}>Aquascapes</Link>
          </div>
        </div>

        <div className={styles.col}>
          <h3>Resources</h3>
          <div className={styles.links}>
            <Link href="/guides" className={styles.link}>Care Guides</Link>
            <Link href="/compatibility" className={styles.link}>Compatibility Checker</Link>
            <Link href="/equipment" className={styles.link}>Equipment Reviews</Link>
          </div>
        </div>

        <div className={styles.col}>
          <h3>Community</h3>
          <div className={styles.links}>
            <Link href="/forum" className={styles.link}>Forum</Link>
            <Link href="/wishlist" className={styles.link}>My Wishlist</Link>
            <Link href="/about" className={styles.link}>About Us</Link>
          </div>
        </div>
      </div>
      
      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} AquaVerse. All rights reserved.</p>
        <p>Built for aquarists.</p>
      </div>
    </footer>
  );
}
