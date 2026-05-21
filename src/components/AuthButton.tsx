"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthButton({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setLoading(false);
  };

  if (userEmail) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {userEmail}
        </span>
        <button 
          onClick={handleSignOut} 
          className="btn-secondary"
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
          disabled={loading}
        >
          {loading ? '...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn-primary">
      Sign In
    </Link>
  );
}
