"use client";

import { useState } from 'react';
import { mockSpecies, getSpeciesById } from '@/data/mockData';
import styles from './page.module.css';

export default function CompatibilityPage() {
  const [speciesA, setSpeciesA] = useState('');
  const [speciesB, setSpeciesB] = useState('');

  // Check compatibility
  let result = null;
  
  if (speciesA && speciesB) {
    if (speciesA === speciesB) {
      result = {
        status: 'warning',
        text: 'Same Species',
        desc: 'Keeping multiple of the same species requires checking if they are schooling fish or territorial. Check the specific care guide.'
      };
    } else {
      const spA = getSpeciesById(speciesA);
      const spB = getSpeciesById(speciesB);

      if (spA && spB) {
        // Are they in each other's compatibility list?
        const isCompatible = spA.compatibility.includes(spB.id) || spB.compatibility.includes(spA.id);
        
        // Also check if they share same water type
        const sameWater = spA.waterType === spB.waterType;

        if (!sameWater) {
          result = {
            status: 'danger',
            text: 'Not Compatible',
            desc: `They require different water types (${spA.waterType} vs ${spB.waterType}).`
          };
        } else if (isCompatible) {
          result = {
            status: 'success',
            text: 'Compatible',
            desc: 'These species generally get along well in a properly sized aquarium.'
          };
        } else {
          result = {
            status: 'danger',
            text: 'Not Recommended',
            desc: 'These species are not known to be good tank mates. They may have different temperament or water parameter requirements.'
          };
        }
      }
    }
  }

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className="heading-lg">Tank Compatibility Checker</h1>
        <p className="text-body" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Select two species to see if they can thrive together in the same aquarium.
        </p>
      </div>

      <div className={styles.checkerBox}>
        <div className={styles.selectors}>
          <div className={styles.selectGroup}>
            <label>Species 1</label>
            <select 
              className={styles.select} 
              value={speciesA} 
              onChange={(e) => setSpeciesA(e.target.value)}
            >
              <option value="">-- Select a species --</option>
              {mockSpecies.map(s => (
                <option key={s.id} value={s.id}>{s.commonName} ({s.category})</option>
              ))}
            </select>
          </div>

          <div className={styles.vs}>VS</div>

          <div className={styles.selectGroup}>
            <label>Species 2</label>
            <select 
              className={styles.select} 
              value={speciesB} 
              onChange={(e) => setSpeciesB(e.target.value)}
            >
              <option value="">-- Select a species --</option>
              {mockSpecies.map(s => (
                <option key={s.id} value={s.id}>{s.commonName} ({s.category})</option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className={styles.result}>
            <div className={styles.statusIcon}>
              {result.status === 'success' && '✅'}
              {result.status === 'warning' && '⚠️'}
              {result.status === 'danger' && '❌'}
            </div>
            <div className={styles.resultText} style={{ 
              color: result.status === 'success' ? 'var(--accent-green)' : 
                     result.status === 'danger' ? '#ff6b6b' : 'var(--accent-gold)'
            }}>
              {result.text}
            </div>
            <p className={styles.resultDesc}>{result.desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
