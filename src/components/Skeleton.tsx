export function SkeletonText({ width = "100%", lines = 1 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={lines > 1 && i === lines - 1 ? { width: "70%" } : { width }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 120 }) {
  return (
    <div
      className="skeleton skeleton-avatar"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonProfile() {
  return (
    <div className="card">
      <SkeletonText width="40%" />
      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          <SkeletonAvatar size={120} />
          <div style={{ flex: 1 }}>
            <SkeletonText lines={3} width="80%" />
          </div>
        </div>
      </div>
      <div className="grid grid-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function SkeletonGrid({ columns = 3, count = 6 }) {
  return (
    <div className={`grid grid-${columns}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
