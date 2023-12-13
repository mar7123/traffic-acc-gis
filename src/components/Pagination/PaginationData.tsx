'use client';

import { Pagination } from 'flowbite-react';
import { useState } from 'react';

function PaginationData({ page }: any) {
    const [currentPage, setCurrentPage] = useState(page);

    const onPageChange = (page: number) => setCurrentPage(page);

    return (
        <div className="flex overflow-x-auto sm:justify-end mx-8">
            <Pagination currentPage={currentPage} totalPages={100} onPageChange={onPageChange} />
        </div>
    );
};
export default PaginationData;

