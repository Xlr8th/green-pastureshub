'use client'
import './Filters.css'
import FilterButton from './FilterButton';

const FilterBar = ({ currentFilter, onFilter, currentSubCategory, onSubCategory, currentSort, onSort }) => {

  const filters = [
    { label: 'All Content', category: 'all' },
    { label: '📝 Articles', category: 'article' },
    { label: '📚 Books', category: 'book' },
    { label: '🎥 Videos', category: 'video' },
    { label: '🎧 Podcasts', category: 'audio' },
  ]; //later in the future we will use this

  const subCategories = [
    { subCategory: 'all', subLabel: 'All Articles' },
    { subCategory: 'word', subLabel: 'Word' },
    { subCategory: 'parenting', subLabel: 'Parenting' },
    { subCategory:'relationships', subLabel: 'Relationships' },
    { subCategory: 'lifestyle', subLabel: 'Lifestyle' },
    { subCategory: 'covenant thought', subLabel: 'Covenant thought'},
    { subCategory: 'ChitChat', subLabel: 'ChitChat'}
  ];

  return (
    <section className="filters">
      <div className="container" data-aos="fade-up">
        <div className="filter-buttons">
          {subCategories.map(({subCategory, subLabel}) => (
            <FilterButton
              key={subCategory} 
              currentSubCategory={currentSubCategory}
              onSubCategory={onSubCategory}
              subCategory={subCategory}
              label={subLabel}
            />
          ) )}
        </div>
              

        <div className="sort-container">
          <label>Sort by:</label>
          <select 
            id="sort-select" 
            value={currentSort}
            onChange={(e) => onSort(e.target.value)}
          >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </section>
  )
}

export default FilterBar;