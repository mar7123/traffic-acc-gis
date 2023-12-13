'use client';

import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex items-center mt-4 max-w-md mx-auto p-2 bg-white border rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow px-2 py-1 focus:outline-none"
      />
      <button className="px-3 py-1 rounded-md ml-2 bg-[#174405] hover:bg-[#EFBE55] font-semibold text-white">Search</button>
    </div>
  );
};

export default SearchBar;