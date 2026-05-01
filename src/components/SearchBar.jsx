import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="kb-search" data-testid="search-bar">
      <Search size={15} className="kb-search-icon" />
      <input
        type="text"
        className="kb-search-input"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="search-input"
      />
      {value && (
        <button
          type="button"
          className="kb-search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
          data-testid="search-clear-btn"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}