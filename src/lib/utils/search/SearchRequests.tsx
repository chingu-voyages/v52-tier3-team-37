"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const SearchRequests = () => {
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
    router.push(`${pathname}?${newSearchParams.toString()}`);
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
