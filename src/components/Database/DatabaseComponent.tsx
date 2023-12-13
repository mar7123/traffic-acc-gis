'use client';

import Loader from "@/components/common/Loader";
import TableData from '@/components/Table Data/TableData';
import { Pagination } from 'flowbite-react';
import { useEffect, useState } from "react";

function DatabaseComponent() {
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch Data
    const [geodatas, setGeodatas] = useState({ data: [], count: 0 });

    // Search, Pagination, Take
    const [currentFilter, setCurrentFilter] = useState({
        search: "",
        take: 10,
        page: 1,
        mode: "default",
        toggle: true
    });

    // Action
    const onPageChange = (page: number) => setCurrentFilter({ ...currentFilter, page: page, toggle: !currentFilter.toggle });
    const geodataAPI = async () => {
        const res = await fetch('/api/geodata?' + new URLSearchParams({
            take: currentFilter.take.toString(),
            page: currentFilter.page.toString()
        }), {
            method: "GET",
            cache: "no-store"
        })
        const { data, count } = await res.json();
        setGeodatas({ data: data, count: count });
    }
    const geodataSearch = async () => {
        const res = await fetch('/api/geodata/search?' + new URLSearchParams({
            filter: currentFilter.search,
            take: currentFilter.take.toString(),
            page: currentFilter.page.toString()
        }), {
            method: "GET",
        })
        const { data, count } = await res.json()
        setGeodatas({ data: data, count: count });
    }

    // Mount
    useEffect(() => {
        setLoading(true)
        if (currentFilter.mode == "search") {
            geodataSearch()
        }
        if (currentFilter.mode == "default") {
            geodataAPI()
        }
        setTimeout(() => setLoading(false), 1000);
    }, [currentFilter.toggle])

    return (
        <>
            <div className="flex items-center mt-4 max-w-md mx-auto p-2 bg-white border rounded-lg shadow-md">
                <input
                    id="search"
                    name="search"
                    type="text"
                    placeholder="Search..."
                    className="flex-grow px-2 py-1 focus:outline-none"
                    value={currentFilter.search}
                    onChange={({ target }) => { setCurrentFilter({ ...currentFilter, search: target.value }) }}
                    onKeyDown={(e: any) => {
                        if (e.key == "Enter") {
                            if (currentFilter.search == "") {
                                setCurrentFilter({ ...currentFilter, mode: "default", toggle: !currentFilter.toggle, page: 1 });
                                return;
                            } else if (currentFilter.search.length <= 3) {
                                window.alert("Please enter more than 3 charaters")
                                return;
                            }
                            setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 });
                        }
                    }}
                />
                <button className="px-3 py-1 rounded-md ml-2 bg-[#174405] hover:bg-[#EFBE55] font-semibold text-white" onClick={(e: any) => {
                    if (currentFilter.search == "") {
                        setCurrentFilter({ ...currentFilter, mode: "default", toggle: !currentFilter.toggle, page: 1 });
                        return;
                    } else if (currentFilter.search.length <= 3) {
                        window.alert("Please enter more than 3 charaters")
                        return;
                    }
                    setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 });
                }}>Search</button>
            </div>
            <div className="relative min-h-[96px] w-full">
                {loading ? (<Loader />) : (
                    <>
                        <TableData data={geodatas.data} />
                        <div className="flex overflow-x-auto sm:justify-end mx-8">
                            <Pagination currentPage={currentFilter.page} totalPages={Math.floor(geodatas.count / currentFilter.take)} onPageChange={onPageChange} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default DatabaseComponent;