import StatCard from './StatCard'
import './Stats.css'

const StatsBar = ({posts}) => {

  const stats = [
    {label: 'Total Post', value: posts.length},
    {label: 'Articles', value: posts.filter(post => post.category === 'article').length},
    {label: 'Books', value: posts.filter(post => post.category === 'book').length},
    {label: 'Video', value: posts.filter(post => post.category === 'video').length}
  ];

  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map(({ label, value }) => (
            <StatCard 
              key={label}
              number={value}
              label={label}
            />
          ))}
      </div>
      </div>
    </section>
  )
};

export default StatsBar;
