"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function WishlistButton({ speciesId }: { speciesId: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAdd = async () => {
    setLoading(true);
    
    // Check if logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Insert into wishlists table
    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: user.id, species_id: speciesId });

    if (error) {
      if (error.code === '23505') {
        // Unique violation, already exists
        setAdded(true);
      } else {
        console.error('Error adding to wishlist:', error.message);
        alert('Failed to add to wishlist.');
      }
    } else {
      setAdded(true);
    }
    
    setLoading(false);
  };

  if (added) {
    return (
      <button className="btn-secondary" style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }} disabled>
        <span style={{ marginRight: '8px' }}>✓</span> Added to Wishlist
      </button>
    );
  }

  return (
    <button className="btn-primary" onClick={handleAdd} disabled={loading}>
      <span style={{ marginRight: '8px' }}>+</span> {loading ? 'Adding...' : 'Add to Wishlist'}
    </button>
  );
}
