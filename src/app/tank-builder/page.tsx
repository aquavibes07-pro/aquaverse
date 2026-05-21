"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';

function TankBuilderContent() {
  const searchParams = useSearchParams();
  const addParam = searchParams.get('add');

  const [allSpecies, setAllSpecies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [tankSize, setTankSize] = useState<number>(20);
  const [selectedSpecies, setSelectedSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchSpecies = async () => {
      const { data } = await supabase.from('species').select('*');
      if (data) {
        setAllSpecies(data);
        
        // Auto-add if URL param exists
        if (addParam) {
          const toAdd = data.find(s => s.id === addParam);
          if (toAdd) {
            setSelectedSpecies([toAdd]);
            // Auto-adjust tank size to min if necessary
            if (toAdd.min_tank_size > 20) {
              setTankSize(toAdd.min_tank_size);
            }
          }
        }
      }
      setLoading(false);
    };
    fetchSpecies();
  }, [addParam]);

  const handleAdd = (sp: any) => {
    // Only add if not already in tank
    if (!selectedSpecies.find(s => s.id === sp.id)) {
      setSelectedSpecies([...selectedSpecies, sp]);
    }
  };

  const handleRemove = (id: string) => {
    setSelectedSpecies(selectedSpecies.filter(s => s.id !== id));
  };

  // --- ECOSYSTEM ANALYSIS LOGIC ---
  const warnings: { type: 'danger' | 'alert' | 'success', title: string, message: string }[] = [];

  if (selectedSpecies.length > 0) {
    // 1. Tank Size Check
    const maxRequiredSize = Math.max(...selectedSpecies.map(s => s.min_tank_size));
    if (tankSize < maxRequiredSize) {
      const demandingFish = selectedSpecies.filter(s => s.min_tank_size === maxRequiredSize).map(s => s.common_name).join(', ');
      warnings.push({
        type: 'danger',
        title: 'Tank Too Small',
        message: `Your tank is ${tankSize}g, but ${demandingFish} requires at least ${maxRequiredSize}g.`
      });
    }

    // 2. Water Type Consistency
    const waterTypes = new Set(selectedSpecies.map(s => s.water_type));
    if (waterTypes.size > 1) {
      warnings.push({
        type: 'danger',
        title: 'Lethal Water Mix',
        message: 'You are mixing freshwater, saltwater, or brackish species together! They cannot survive in the same tank.'
      });
    }

    // 3. Parameter Overlap (Temp & pH)
    let minT = 0; let maxT = 100;
    let minP = 0; let maxP = 14;

    selectedSpecies.forEach(s => {
      if (s.temp_min > minT) minT = s.temp_min;
      if (s.temp_max < maxT) maxT = s.temp_max;
      if (s.ph_min > minP) minP = s.ph_min;
      if (s.ph_max < maxP) maxP = s.ph_max;
    });

    if (minT > maxT) {
      warnings.push({
        type: 'danger',
        title: 'Temperature Conflict',
        message: 'There is no overlapping safe temperature range for all selected species.'
      });
    } else if (selectedSpecies.length > 1) {
      warnings.push({
        type: 'success',
        title: 'Safe Temperature',
        message: `Keep your heater set between ${minT}°C and ${maxT}°C.`
      });
    }

    if (minP > maxP) {
      warnings.push({
        type: 'danger',
        title: 'pH Conflict',
        message: 'There is no overlapping safe pH range for all selected species.'
      });
    }

    // 4. Social Compatibility Checks
    selectedSpecies.forEach(sp1 => {
      selectedSpecies.forEach(sp2 => {
        if (sp1.id !== sp2.id) {
          // If sp1 has a compatibility list, does it include sp2?
          if (sp1.compatibility && sp1.compatibility.length > 0) {
            if (!sp1.compatibility.includes(sp2.id)) {
              // It's not explicitly compatible, let's just warn if they have different temperaments
              if (sp1.temperament === 'aggressive' && sp2.temperament === 'peaceful') {
                 warnings.push({
                   type: 'danger',
                   title: 'Aggression Warning',
                   message: `${sp1.common_name} is aggressive and may attack the peaceful ${sp2.common_name}.`
                 });
              }
            }
          }
        }
      });
    });

    // Deduplicate warnings
    const uniqueWarnings = Array.from(new Set(warnings.map(w => w.message)))
      .map(msg => warnings.find(w => w.message === msg)!);

    warnings.splice(0, warnings.length, ...uniqueWarnings);
  }

  // Filter for sidebar
  const filteredSpecies = allSpecies.filter(s => 
    s.common_name.toLowerCase().includes(search.toLowerCase()) || 
    s.scientific_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className="heading-xl" style={{ marginBottom: 'var(--spacing-sm)' }}>Advanced Tank Builder</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Select your tank size and add species to analyze ecosystem compatibility.
        </p>
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR: Species Picker */}
        <aside className={styles.sidebar}>
          <input 
            type="text" 
            placeholder="Search species to add..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.speciesList}>
            {loading ? <div style={{ padding: 'var(--spacing-md)' }}>Loading catalog...</div> : 
             filteredSpecies.map(sp => (
              <div key={sp.id} className={styles.speciesItem} onClick={() => handleAdd(sp)}>
                <div className={styles.speciesInfo}>
                  <div style={{ width: '40px', height: '40px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                    <Image src={sp.image_url} alt={sp.common_name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{sp.common_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sp.difficulty} • Min {sp.min_tank_size}g</div>
                  </div>
                </div>
                <button className={styles.addButton}>+</button>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN AREA: Tank & Analysis */}
        <main className={styles.mainArea}>
          <div className={styles.controls}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Your Tank Size (Gallons)
              </label>
              <input 
                type="number" 
                value={tankSize}
                onChange={(e) => setTankSize(Math.max(1, parseInt(e.target.value) || 1))}
                className={styles.tankInput}
              />
            </div>
          </div>

          <div className={styles.tankVisual}>
            {selectedSpecies.length === 0 ? (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Your tank is empty. Add species from the sidebar.
              </div>
            ) : (
              selectedSpecies.map(sp => (
                <div key={sp.id} className={styles.selectedCard}>
                  <button className={styles.removeBtn} onClick={() => handleRemove(sp.id)}>×</button>
                  <div style={{ width: '50px', height: '50px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                    <Image src={sp.image_url} alt={sp.common_name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sp.common_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sp.category}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.analysisPanel}>
            <h2 className="heading-md" style={{ marginBottom: 'var(--spacing-xs)' }}>Ecosystem Analysis</h2>
            
            {selectedSpecies.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Add at least one species to see compatibility analysis.</p>
            ) : warnings.length === 0 ? (
              <div className={`${styles.warningBox} ${styles.warningSuccess}`}>
                <div className={styles.warningTitle}>✅ Ecosystem Looks Good!</div>
                <div>Your selected species share compatible water parameters and tank requirements.</div>
              </div>
            ) : (
              warnings.map((w, idx) => (
                <div key={idx} className={`${styles.warningBox} ${
                  w.type === 'danger' ? styles.warningDanger : 
                  w.type === 'success' ? styles.warningSuccess : styles.warningAlert
                }`}>
                  <div className={styles.warningTitle}>
                    {w.type === 'danger' ? '⚠️' : w.type === 'success' ? '✅' : 'ℹ️'} {w.title}
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>{w.message}</div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function TankBuilderPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>Loading Builder...</div>}>
      <TankBuilderContent />
    </Suspense>
  );
}
