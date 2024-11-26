"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface SearchRequestsProps {
  onSearch: (query: string) => void;
}

const SearchRequests: React.FC<SearchRequestsProps> = ({ onSearch }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newSearchParams.set("query", query);
    } else {
      newSearchParams.delete("query");
    }

    // Update the URL with the new query params
    router.push(`${pathname}?${newSearchParams.toString()}`);

    // Call the onSearch prop to filter data
    onSearch(query);
  };

  return (
    <div className="flex items-center justify-center mb-4">
      <input
        type="text"
        placeholder="Search by name or email"
        className="border border-gray-300 rounded-md px-4 py-2 mr-2 w-full"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchRequests;
