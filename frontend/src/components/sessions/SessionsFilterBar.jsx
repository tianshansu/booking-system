import "./SessionsFilterBar.css";

export default function SessionsFilterBar() {
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
          <select className="sessions-filter-bar-item-select">
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select className="sessions-filter-bar-item-select">
            <option value="">Type: All</option>
            <option value="consultation">Consultation</option>
            <option value="training">Training</option>
            <option value="follow-up">Follow-up</option>
          </select>

          <select className="sessions-filter-bar-item-select">
            <option value="">Staff: All</option>
            <option value="staff1">Staff 1</option>
            <option value="staff2">Staff 2</option>
            <option value="staff3">Staff 3</option>
          </select>
        </div>
        <div className="sessions-filter-bar-item-right">
          <button className="sessions-filter-bar-item-button">
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
