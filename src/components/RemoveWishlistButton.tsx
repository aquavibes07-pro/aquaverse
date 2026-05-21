"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function RemoveWishlistButton({ wishlistId }: { wishlistId: string }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if this is inside a Link
    e.stopPropagation();
    
    setLoading(true);
    
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', wishlistId);

    if (error) {
      console.error('Error removing from wishlist:', error.message);
      alert('Failed to remove from wishlist.');
    } else {
      router.refresh(); // Refresh the Server Component to update the list
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleRemove} 
      disabled={loading}
      style={{
        background: 'rgba(255, 107, 107, 0.1)',
        color: '#ff6b6b',
        border: '1px solid rgba(255, 107, 107, 0.2)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        zIndex: 10
      }}
    >
      {loading ? 'Removing...' : 'Remove'}
    </button>
  );
}
