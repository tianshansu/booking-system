import "../../styles/filterbar.css";

export default function PeopleFilterBar({
  onFilterStatus,
  filterStatus,
  onFilterName,
  filterName,
  onClear,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-item">
        <div className="filter-bar-item-left">
          <img
            src="/icons/filter.svg"
            className="filter-bar-item-icon"
            alt="filter"
          />
          <div>Filter by:</div>
          <select
            className="filter-bar-item-select"
            onChange={(e) => onFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option value="">Status: All</option>
            <option value="0">Active</option>
            <option value="1">Inactive</option>
          </select>

          {/* sorting */}
          <div>Sort by:</div>
          <select
            className="filter-bar-item-select"
            onChange={(e) => onFilterName(e.target.value)}
            value={filterName}
          >
            <option value="">Default</option>
            <option value="asc">Name: A to Z</option>
            <option value="desc">Name: Z to A</option>
          </select>
        </div>
        <div className="filter-bar-item-right">
          <button className="filter-bar-item-button" onClick={onClear}>
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
