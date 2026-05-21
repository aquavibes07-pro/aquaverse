import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import RemoveWishlistButton from '@/components/RemoveWishlistButton';
import styles from './page.module.css';

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch wishlists joined with species
  const { data: wishlists, error } = await supabase
    .from('wishlists')
    .select(`
      id,
      species:species_id (
        id,
        common_name,
        scientific_name,
        difficulty,
        min_tank_size,
        temperament,
        image_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlists:', error);
  }

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Wishlist</h1>
        <p className={styles.description}>
          Plan your dream aquarium. Keep track of the species you want to keep.
        </p>
      </div>

      {!wishlists || wishlists.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
          <p className={styles.emptyText}>
            You haven't added any species to your wishlist yet. Explore our catalog to find the perfect additions for your tank!
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
            <Link href="/catalog/fish" className="btn-primary" style={{ textDecoration: 'none' }}>
              Browse Fish
            </Link>
            <Link href="/catalog/plants" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Browse Plants
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid-cards">
          {wishlists.map((item: any) => {
            const species = item.species;
            // Handle cases where species might be deleted but wishlist record remains
            if (!species) return null;

            return (
              <div key={item.id} style={{ position: 'relative' }}>
                <div className={styles.removeWrapper}>
                  <RemoveWishlistButton wishlistId={item.id} />
                </div>
                
                <Link href={`/species/${species.id}`} className={styles.card}>
                  <div className={styles.cardImageContainer}>
                    <Image 
                      src={species.image_url} 
                      alt={species.common_name}
                      fill
                      className={styles.cardImage}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{species.common_name}</h3>
                    </div>
                    <div className="scientific-name" style={{ marginBottom: 'auto' }}>
                      {species.scientific_name}
                    </div>
                    <div className={styles.cardTags}>
                      <span className={`badge badge-${species.difficulty}`}>
                        {species.difficulty}
                      </span>
                      <span className="badge" style={{ background: 'var(--border-color)' }}>
                        {species.min_tank_size}g+
                      </span>
                      {species.temperament && (
                        <span className="badge" style={{ background: 'var(--border-color)' }}>
                          {species.temperament}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
