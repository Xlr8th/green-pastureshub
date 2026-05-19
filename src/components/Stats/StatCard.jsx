import './Stats.css'
function StatCard({ number, label }) {
  return (
    <div className="stat-card">
        <h3>{number}</h3>
        <p>{label}</p>
    </div>
  )
}

export default StatCard;
