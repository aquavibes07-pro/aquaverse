import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import WishlistButton from '@/components/WishlistButton';
import CommentsSection from '@/components/CommentsSection';
import styles from './page.module.css';

export default async function SpeciesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: species, error } = await supabase
    .from('species')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !species) {
    notFound();
  }

  // Convert snake_case to camelCase for the template
  const sp = {
    id: species.id,
    commonName: species.common_name,
    scientificName: species.scientific_name,
    category: species.category,
    difficulty: species.difficulty,
    minTankSize: species.min_tank_size,
    temperament: species.temperament,
    waterType: species.water_type,
    origin: species.origin,
    colors: species.colors,
    tempMin: species.temp_min,
    tempMax: species.temp_max,
    phMin: species.ph_min,
    phMax: species.ph_max,
    description: species.description,
    care: species.care,
    compatibility: species.compatibility || [],
    imageUrl: species.image_url,
  };

  // Fetch compatible species details
  const { data: compatibleData } = await supabase
    .from('species')
    .select('id, common_name, scientific_name, image_url')
    .in('id', sp.compatibility.length > 0 ? sp.compatibility : ['__empty__']);

  const compatibleSpecies = compatibleData ? compatibleData.map(c => ({
    id: c.id,
    commonName: c.common_name,
    scientificName: c.scientific_name,
    imageUrl: c.image_url
  })) : [];

  let categoryPlural = 'fish';
  if (sp.category === 'plant') categoryPlural = 'plants';
  if (sp.category === 'invertebrate') categoryPlural = 'invertebrates';

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt;{' '}
        <Link href={`/catalog/${categoryPlural}`}>
          {categoryPlural.charAt(0).toUpperCase() + categoryPlural.slice(1)}
        </Link>{' '}
        &gt; <span>{sp.commonName}</span>
      </div>

      <div className={styles.hero}>
        <div className={styles.imageContainer}>
          <Image 
            src={sp.imageUrl} 
            alt={sp.commonName}
            fill
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{sp.commonName}</h1>
          <div className={`scientific-name ${styles.scientificName}`}>
            {sp.scientificName}
          </div>

          <div className={styles.tags}>
            <span className={`badge badge-${sp.difficulty}`}>
              {sp.difficulty}
            </span>
            <span className="badge" style={{ background: 'var(--border-color)' }}>
              Min {sp.minTankSize}g
            </span>
            {sp.temperament && (
              <span className="badge" style={{ background: 'var(--border-color)' }}>
                {sp.temperament}
              </span>
            )}
            <span className="badge" style={{ background: 'var(--accent-teal)', color: 'var(--bg-primary)' }}>
              {sp.waterType}
            </span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Origin</div>
              <div className={styles.statValue}>{sp.origin}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Colors</div>
              <div className={styles.statValue}>{sp.colors.join(', ')}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Temperature</div>
              <div className={styles.statValue}>{sp.tempMin}°C - {sp.tempMax}°C</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>pH Range</div>
              <div className={styles.statValue}>{Number(sp.phMin).toFixed(1)} - {Number(sp.phMax).toFixed(1)}</div>
            </div>
          </div>

          <div className={styles.actions}>
            <WishlistButton speciesId={sp.id} />
            <Link href={`/tank-builder?add=${sp.id}`} className="btn-secondary" style={{ textDecoration: 'none' }}>
              Check Compatibility
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <p className={styles.text}>{sp.description}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Care & Setup</h2>
            <p className={styles.text}>{sp.care}</p>
          </section>
        </div>

        <aside className={styles.sidebar}>
          {compatibleSpecies.length > 0 && (
            <div className={styles.sidebarBox}>
              <h3>Compatible Tank Mates</h3>
              <div className={styles.compatList}>
                {compatibleSpecies.map(mate => (
                  <Link key={mate.id} href={`/species/${mate.id}`} className={styles.compatItem}>
                    <div style={{ width: '40px', height: '40px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                      <Image src={mate.imageUrl} alt={mate.commonName} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{mate.commonName}</div>
                      <div className="scientific-name" style={{ fontSize: '0.8rem' }}>{mate.scientificName}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className={styles.sidebarBox}>
            <h3>Did you know?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Properly cycling your aquarium before adding {sp.commonName.toLowerCase()} is crucial for their long-term health and survival.
            </p>
          </div>
        </aside>
      </div>

      <CommentsSection speciesId={sp.id} />
    </div>
  );
}
