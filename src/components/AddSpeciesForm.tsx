"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './AddSpeciesForm.module.css';

export default function AddSpeciesForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;
    
    try {
      let imageUrl = '';

      // 1. Upload Image to Supabase Storage
      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `species/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('species-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('species-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      } else {
        throw new Error("An image is required.");
      }

      // 2. Insert into Database
      const speciesData = {
        id: formData.get('id') as string,
        common_name: formData.get('common_name') as string,
        scientific_name: formData.get('scientific_name') as string,
        category: formData.get('category') as string,
        difficulty: formData.get('difficulty') as string,
        min_tank_size: parseInt(formData.get('min_tank_size') as string),
        temperament: formData.get('temperament') as string || null,
        origin: formData.get('origin') as string,
        colors: (formData.get('colors') as string).split(',').map(c => c.trim()),
        water_type: formData.get('water_type') as string,
        ph_min: parseFloat(formData.get('ph_min') as string),
        ph_max: parseFloat(formData.get('ph_max') as string),
        temp_min: parseFloat(formData.get('temp_min') as string),
        temp_max: parseFloat(formData.get('temp_max') as string),
        description: formData.get('description') as string,
        care: formData.get('care') as string,
        compatibility: [], // Can be updated later
        image_url: imageUrl,
        featured: formData.get('featured') === 'on'
      };

      const { error: insertError } = await supabase
        .from('species')
        .insert([speciesData]);

      if (insertError) throw new Error(`Database Insert Failed: ${insertError.message}`);

      setSuccess(`Successfully added ${speciesData.common_name}!`);
      (e.target as HTMLFormElement).reset();

    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Unique ID (e.g., f6, p4)</label>
          <input name="id" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Common Name</label>
          <input name="common_name" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Scientific Name</label>
          <input name="scientific_name" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Category</label>
          <select name="category" required className={styles.select}>
            <option value="fish">Fish</option>
            <option value="plant">Plant</option>
            <option value="invertebrate">Invertebrate</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Difficulty</label>
          <select name="difficulty" required className={styles.select}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Water Type</label>
          <select name="water_type" required className={styles.select}>
            <option value="freshwater">Freshwater</option>
            <option value="brackish">Brackish</option>
            <option value="saltwater">Saltwater</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Min Tank Size (Gallons)</label>
          <input name="min_tank_size" type="number" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Temperament</label>
          <input name="temperament" className={styles.input} placeholder="e.g., peaceful" />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Origin</label>
          <input name="origin" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Colors (comma separated)</label>
          <input name="colors" required className={styles.input} placeholder="Red, Blue, Silver" />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Temp Min (°C)</label>
          <input name="temp_min" type="number" step="0.1" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Temp Max (°C)</label>
          <input name="temp_max" type="number" step="0.1" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>pH Min</label>
          <input name="ph_min" type="number" step="0.1" required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>pH Max</label>
          <input name="ph_max" type="number" step="0.1" required className={styles.input} />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Description</label>
          <textarea name="description" required className={styles.textarea} />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Care Instructions</label>
          <textarea name="care" required className={styles.textarea} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Image Upload</label>
          <input name="image" type="file" accept="image/*" required className={styles.input} style={{ padding: 'var(--spacing-sm)' }} />
        </div>

        <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <input name="featured" type="checkbox" id="featured" />
          <label htmlFor="featured" className={styles.label}>Featured on Home Page?</label>
        </div>
      </div>

      <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
        {loading ? 'Uploading & Saving...' : 'Add Species'}
      </button>
    </form>
  );
}
