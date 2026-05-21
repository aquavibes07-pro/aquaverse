"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';

export default function CatalogPage() {
  const params = useParams();
  const categoryStr = params?.category as string;
  const supabase = createClient();
  
  // Handle pluralization routing
  let normalizedCategory = 'fish';
  if (categoryStr === 'plants') normalizedCategory = 'plant';
  if (categoryStr === 'invertebrates') normalizedCategory = 'invertebrate';
  if (categoryStr === 'fish') normalizedCategory = 'fish';

  const [initialData, setInitialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('species')
        .select('*')
        .eq('category', normalizedCategory);
        
      if (!error && data) {
        // Map snake_case to camelCase
        const mappedData = data.map(s => ({
          id: s.id,
          commonName: s.common_name,
          scientificName: s.scientific_name,
          category: s.category,
          difficulty: s.difficulty,
          minTankSize: s.min_tank_size,
          temperament: s.temperament,
          waterType: s.water_type,
          imageUrl: s.image_url,
          featured: s.featured,
        }));
        setInitialData(mappedData);
      }
      setLoading(false);
    };
    fetchData();
  }, [normalizedCategory]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedWaterType, setSelectedWaterType] = useState<string[]>([]);

  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
    );
  };

  const handleWaterTypeChange = (wt: string) => {
    setSelectedWaterType(prev => 
      prev.includes(wt) ? prev.filter(w => w !== wt) : [...prev, wt]
    );
  };

  const filteredData = useMemo(() => {
    return initialData.filter(species => {
      // Search
      const matchesSearch = 
        species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        species.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filters
      const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(species.difficulty);
      const matchesWaterType = selectedWaterType.length === 0 || selectedWaterType.includes(species.waterType);

      return matchesSearch && matchesDifficulty && matchesWaterType;
    });
  }, [initialData, searchQuery, selectedDifficulty, selectedWaterType]);

  const pageTitles: Record<string, string> = {
    fish: "Freshwater Fish",
    plant: "Aquatic Plants",
    invertebrate: "Invertebrates"
  };

  const pageDescriptions: Record<string, string> = {
    fish: "Explore our comprehensive catalog of freshwater fish species, from peaceful community tetras to majestic cichlids.",
    plant: "Discover lush aquatic plants to create a natural ecosystem and perfect aquascape.",
    invertebrate: "Find the perfect clean-up crew and fascinating invertebrate additions for your tank."
  };

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{pageTitles[normalizedCategory] || categoryStr}</h1>
        <p className={styles.description}>
          {pageDescriptions[normalizedCategory]}
        </p>
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <input 
            type="text" 
            placeholder="Search by name..." 
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Difficulty</h3>
            {['beginner', 'intermediate', 'expert'].map(diff => (
              <label key={diff} className={styles.filterLabel}>
                <input 
                  type="checkbox" 
                  className={styles.filterInput}
                  checked={selectedDifficulty.includes(diff)}
                  onChange={() => handleDifficultyChange(diff)}
                />
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Water Type</h3>
            {['freshwater', 'brackish', 'saltwater'].map(wt => (
              <label key={wt} className={styles.filterLabel}>
                <input 
                  type="checkbox" 
                  className={styles.filterInput}
                  checked={selectedWaterType.includes(wt)}
                  onChange={() => handleWaterTypeChange(wt)}
                />
                {wt.charAt(0).toUpperCase() + wt.slice(1)}
              </label>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="grid-cards">
          {loading ? (
            <div className={styles.noResults} style={{ gridColumn: '1 / -1' }}>
              <h3 className="heading-md">Loading...</h3>
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((species) => (
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
                  <div className="scientific-name" style={{ marginBottom: 'auto' }}>
                    {species.scientificName}
                  </div>
                  <div className={styles.cardTags}>
                    <span className={`badge badge-${species.difficulty}`}>
                      {species.difficulty}
                    </span>
                    <span className="badge" style={{ background: 'var(--border-color)' }}>
                      {species.minTankSize}g+
                    </span>
                    {species.temperament && (
                      <span className="badge" style={{ background: 'var(--border-color)' }}>
                        {species.temperament}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3 className="heading-md">No species found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
