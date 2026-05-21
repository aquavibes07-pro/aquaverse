"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import styles from './CommentsSection.module.css';

export default function CommentsSection({ speciesId }: { speciesId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  const fetchComments = async () => {
    setLoading(true);
    // Join with profiles table to get the author's email
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(email)')
      .eq('species_id', speciesId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      await fetchComments();
    };
    init();
  }, [speciesId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('comments')
      .insert({
        species_id: speciesId,
        user_id: user.id,
        content: newComment.trim()
      });

    if (!error) {
      setNewComment('');
      await fetchComments();
    } else {
      console.error('Failed to post comment:', error.message);
      alert('Failed to post comment.');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Community Tips & Reviews</h2>

      <div className={styles.commentList}>
        {loading ? (
          <div className={styles.emptyState}>Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className={styles.emptyState}>No comments yet. Be the first to share your experience!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentCard}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>
                  {comment.profiles?.email ? comment.profiles.email.split('@')[0] : 'Anonymous User'}
                </span>
                <span className={styles.commentDate}>
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.commentContent}>{comment.content}</div>
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className={styles.formBox}>
          <h3 className={styles.formTitle}>Leave a comment</h3>
          <textarea 
            className={styles.textarea}
            placeholder="Share your setup, tips, or ask a question about this species..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={submitting || !newComment.trim()}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className={styles.loginPrompt}>
          <p style={{ marginBottom: 'var(--spacing-md)' }}>Have experience with this species?</p>
          <Link href="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            Sign in to leave a comment
          </Link>
        </div>
      )}
    </div>
  );
}
