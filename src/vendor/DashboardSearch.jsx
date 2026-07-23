import VendorSearch from "./VendorSearch";

export default function DashboardSearch({ searchQuery, searchServiceType, searching, searchError, onSearchQueryChange, onServiceTypeChange, onSearch }) {
  return (
    <VendorSearch
      searchQuery={searchQuery}
      setSearchQuery={onSearchQueryChange}
      searchServiceType={searchServiceType}
      setSearchServiceType={onServiceTypeChange}
      searching={searching}
      searchError={searchError}
      onSearch={onSearch}
    />
  );
}
