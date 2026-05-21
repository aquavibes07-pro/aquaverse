import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddSpeciesForm from '@/components/AddSpeciesForm';
import styles from './page.module.css';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.description}>
          Add new fish, plants, and invertebrates directly to the catalog.
        </p>
      </div>

      <div className={styles.adminBox}>
        <h2 className="heading-md" style={{ marginBottom: 'var(--spacing-lg)' }}>Add New Species</h2>
        <AddSpeciesForm />
      </div>
    </div>
  );
}
