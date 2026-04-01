import "../../styles/filterbar.css";

export default function SessionsFilterBar({
  onFilterStatus,
  filterStatus,
  onFilterStaff,
  filterStaff,
  onFilterSortTime,
  filterSortTime,
  staffOptions,
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
            <option value="0">Scheduled</option>
            <option value="1">Completed</option>
            <option value="2">Canceled</option>
          </select>

          <select
            className="filter-bar-item-select"
            onChange={(e) => onFilterStaff(e.target.value)}
            value={filterStaff}
          >
            <option value="">Staff: All</option>
            {staffOptions.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>

          {/* sorting */}
          <div>Sort by:</div>
          <select
            className="filter-bar-item-select"
            onChange={(e) => onFilterSortTime(e.target.value)}
            value={filterSortTime}
          >
            <option value="">Default</option>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
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
