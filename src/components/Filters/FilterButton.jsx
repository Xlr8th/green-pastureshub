'use client'
import './Filters.css'

const FilterButton = ( {label, subCategory, currentSubCategory, onSubCategory} ) => {

    return (
        <button 
        className={`filter-btn ${subCategory === currentSubCategory ? 'active' : ''}`} onClick={() => onSubCategory(subCategory)}
        >
            {label}
        </button>
    )
};

export default FilterButton;