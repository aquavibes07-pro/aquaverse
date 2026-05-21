import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getFeaturedSpecies } from '@/data/mockData';

export default function Home() {
  const featuredSpecies = getFeaturedSpecies();

  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image 
          src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1920&q=80" 
          alt="Beautiful aquascape"
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>Premium Encyclopedia</span>
          <h1 className={styles.heroTitle}>Master the Art of Aquascaping</h1>
          <p className={styles.heroDesc}>
            Discover detailed care guides, build compatibility lists, and explore a beautifully curated catalog of freshwater fish, plants, and invertebrates.
          </p>
          <div className={styles.heroActions}>
            <Link href="/catalog/fish" className="btn-primary">
              Explore Catalog
            </Link>
            <Link href="/guides" className="btn-secondary">
              Read Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Species */}
      <section className={`container ${styles.featuredSection}`}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className="heading-lg">Featured Species</h2>
            <p className="text-body">Hand-picked selections for your next tank build.</p>
          </div>
          <Link href="/catalog/fish" className={styles.viewAll}>
            View All Fish →
          </Link>
        </div>

        <div className="grid-cards">
          {featuredSpecies.map((species) => (
            <Link href={`/species/${species.id}`} key={species.id} className={styles.card}>
              <div className={styles.cardImageContainer}>
                <Image 
                  src={species.imageUrl} 
                  alt={species.commonName}
                  fill
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{species.commonName}</h3>
                </div>
                <div className="scientific-name">{species.scientificName}</div>
                <div className={styles.cardTags}>
                  <span className={`badge badge-${species.difficulty}`}>
                    {species.difficulty}
                  </span>
                  <span className="badge" style={{ background: 'var(--border-color)' }}>
                    {species.minTankSize}g+
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <h2 className="heading-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>Browse by Category</h2>
          
          <div className={styles.categoryGrid}>
            <Link href="/catalog/fish" className={styles.catCard}>
              <Image 
                src="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80" 
                alt="Freshwater Fish"
                fill
                className={styles.catImage}
              />
              <div className={styles.catOverlay}></div>
              <div className={styles.catContent}>
                <h3>Freshwater Fish</h3>
                <p>From peaceful tetras to majestic cichlids</p>
              </div>
            </Link>

            <Link href="/catalog/plants" className={styles.catCard}>
              <Image 
                src="https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80" 
                alt="Aquatic Plants"
                fill
                className={styles.catImage}
              />
              <div className={styles.catOverlay}></div>
              <div className={styles.catContent}>
                <h3>Aquatic Plants</h3>
                <p>Create a lush, natural ecosystem</p>
              </div>
            </Link>

            <Link href="/catalog/invertebrates" className={styles.catCard}>
              <Image 
                src="https://images.unsplash.com/photo-1628156172605-ff0d8299dd6c?auto=format&fit=crop&w=800&q=80" 
                alt="Invertebrates"
                fill
                className={styles.catImage}
              />
              <div className={styles.catOverlay}></div>
              <div className={styles.catContent}>
                <h3>Invertebrates</h3>
                <p>Shrimp, snails, and clean-up crews</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
