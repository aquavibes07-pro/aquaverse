import Image from 'next/image';

const scapes = [
  { id: 1, title: 'Nature Aquarium', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80', desc: 'Inspired by terrestrial landscapes, characterized by asymmetrical layouts and driftwood.' },
  { id: 2, title: 'Iwagumi Style', img: 'https://images.unsplash.com/photo-1594968132049-36104f7c10b0?auto=format&fit=crop&w=800&q=80', desc: 'Minimalist stone layouts with a focus on harmony, proportion, and negative space.' },
  { id: 3, title: 'Dutch Aquascape', img: 'https://images.unsplash.com/photo-1623869687002-c923d3ba928a?auto=format&fit=crop&w=800&q=80', desc: 'Dense, colorful plant arrangements resembling a well-manicured flower garden. No hardscape used.' }
];

export default function AquascapesPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
        <h1 className="heading-lg">Aquascape Inspiration</h1>
        <p className="text-body" style={{ maxWidth: '600px', margin: '0 auto' }}>Explore the art of underwater gardening. Discover various styles and gather inspiration for your next tank build.</p>
      </div>

      <div className="grid-cards">
        {scapes.map(scape => (
          <div key={scape.id} className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: '250px', position: 'relative' }}>
              <Image src={scape.img} alt={scape.title} fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>{scape.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{scape.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
