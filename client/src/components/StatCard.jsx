function StatCard({ icon: Icon, label, value, accentColor }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ color: accentColor }}>
        <Icon size={22} />
      </div>
      <div className="stat-card-info">
        <p className="stat-card-value">{value}</p>
        <p className="stat-card-label">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;