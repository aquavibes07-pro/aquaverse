export default function EquipmentPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
      <h1 className="heading-lg" style={{ marginBottom: 'var(--spacing-md)' }}>Equipment Reviews</h1>
      <p className="text-body" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: 'var(--spacing-2xl)' }}>
        We are currently testing the latest aquarium gear. Check back soon for comprehensive reviews on filters, lights, heaters, and CO2 systems.
      </p>
      
      <div className="glass-panel" style={{ padding: 'var(--spacing-2xl)', display: 'inline-block', borderStyle: 'dashed' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>Coming Soon</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Our team is setting up test tanks right now.</p>
      </div>
    </div>
  );
}
