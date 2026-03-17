import "./SessionsFilterBar.css";

export default function SessionsFilterBar({
  onFilterStatus,
  filterStatus,
  onFilterStaff,
  filterStaff,
  staffOptions,
  onClear,
}) {
  return (
    <div className="sessions-filter-bar">
      <div className="sessions-filter-bar-item">
        <div className="sessions-filter-bar-item-left">
          <img
            src="/icons/filter.svg"
            className="sessions-filter-bar-item-icon"
            alt="filter"
          />
          <div>Filter by:</div>
          <select
            className="sessions-filter-bar-item-select"
            onChange={(e) => onFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option value="">Status: All</option>
            <option value="0">Scheduled</option>
            <option value="1">Completed</option>
            <option value="2">Canceled</option>
          </select>

          <select
            className="sessions-filter-bar-item-select"
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
        </div>
        <div className="sessions-filter-bar-item-right">
          <button className="sessions-filter-bar-item-button" onClick={onClear}>
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
