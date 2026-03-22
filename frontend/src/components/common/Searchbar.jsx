import "./Searchbar.css";

export default function Searchbar({ placeholder, value, onChange }) {
  return (
    <div className="search-wrapper">
      <img src="/icons/search.svg" alt="search" className="search-icon" />
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
