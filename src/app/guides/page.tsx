import Link from 'next/link';

export default function GuidesPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <h1 className="heading-lg" style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>Care Guides & Tutorials</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)', maxWidth: '800px', margin: '0 auto' }}>
        {[
          { title: 'The Nitrogen Cycle Explained', desc: 'Learn how to properly cycle your aquarium to keep your fish safe from ammonia spikes.', tag: 'Basics' },
          { title: 'Choosing the Right Filter', desc: 'Hang-on-back, canister, or sponge? We break down the pros and cons of each.', tag: 'Equipment' },
          { title: 'Battling Algae: A Comprehensive Guide', desc: 'Identify your algae type and learn the best strategies to eradicate it naturally.', tag: 'Maintenance' },
        ].map((guide, i) => (
          <div key={i} className="glass-panel" style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <span className="badge" style={{ background: 'var(--border-color)', width: 'fit-content' }}>{guide.tag}</span>
            <h3 style={{ fontSize: '1.5rem' }}>{guide.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{guide.desc}</p>
            <Link href="#" style={{ color: 'var(--accent-teal)', marginTop: 'var(--spacing-sm)', fontWeight: 600 }}>Read Article →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
