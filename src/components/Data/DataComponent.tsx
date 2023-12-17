'use client';

import Loader from "@/components/common/Loader";
import { Button, Dropdown, Label, Table, TextInput } from 'flowbite-react';
import Link from "next/link";
import { Pagination } from 'flowbite-react';
import { useEffect, useState } from "react";

interface GeoDatas {
    id: String,
    wilayah: string,
    tahun: number,
    jumlah_kecelakaan: number,
    meninggal: number,
    luka_berat: number,
    luka_ringan: number,
    kerugian: number,
}
function DataComponent() {
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch Data
    const [geodatas, setGeodatas] = useState<{ data: GeoDatas[], count: number }>({ data: [], count: 0 });

    // Search, Pagination, Take
    const [currentFilter, setCurrentFilter] = useState({
        search: "",
        take: 10,
        page: 1,
        mode: "default",
        toggle: true
    });

    // Action
    const onPageChange = (page: number) => { setCurrentFilter({ ...currentFilter, page: page, toggle: !currentFilter.toggle }) };
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
        setLoading(false);
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
        setLoading(false);
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
    }, [currentFilter.toggle])

    return (
        <>
            <div className="flex max-w-full w-5/6 gap-2 my-2">
                <div className="w-10/12">
                    <TextInput id="search-bar" type="text" placeholder="Search" value={currentFilter.search} onChange={({ target }) => { setCurrentFilter({ ...currentFilter, search: target.value }) }} onKeyDown={(e: any) => {
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
                    }} />
                </div>
                <Button type="submit" className="w-2/12 bg-black text-white" onClick={(e: any) => {
                    if (currentFilter.search == "") {
                        setCurrentFilter({ ...currentFilter, mode: "default", toggle: !currentFilter.toggle, page: 1 });
                        return;
                    } else if (currentFilter.search.length <= 3) {
                        window.alert("Please enter more than 3 charaters")
                        return;
                    }
                    setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 });
                }}>Search</Button>
            </div>
            <div className="flex flex-col items-end h-fit w-full my-2 px-2">
                <Dropdown label="Take" style={{ backgroundColor: "black", color: "white" }} dismissOnClick={false}>
                    <li className="" onClick={() => setCurrentFilter({ ...currentFilter, take: 10, toggle: !currentFilter.toggle, page: 1 })}>
                        <Button type="button" className={"flex items-center justify-start py-2 px-4 text-sm cursor-pointer w-full dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white" + (currentFilter.take == 10 ? " text-white bg-black" : " text-gray-700 bg-white hover:bg-gray-100")} tabIndex={-1}>
                            10
                        </Button>
                    </li>
                    <li className="" onClick={() => setCurrentFilter({ ...currentFilter, take: 25, toggle: !currentFilter.toggle, page: 1 })}>
                        <Button type="button" className={"flex items-center justify-start py-2 px-4 text-sm cursor-pointer w-full dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white" + (currentFilter.take == 25 ? " text-white bg-black" : " text-gray-700 bg-white hover:bg-gray-100")} tabIndex={-1}>
                            25
                        </Button>
                    </li>
                    <li className="" onClick={() => setCurrentFilter({ ...currentFilter, take: 50, toggle: !currentFilter.toggle, page: 1 })}>
                        <Button type="button" className={"flex items-center justify-start py-2 px-4 text-sm cursor-pointer w-full dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white" + (currentFilter.take == 50 ? " text-white bg-black" : " text-gray-700 bg-white hover:bg-gray-100")} tabIndex={-1}>
                            50
                        </Button>
                    </li>
                </Dropdown>
            </div>
            <div className="relative min-h-[96px] w-full">
                {loading ? (<Loader />) : (
                    <>
                        <div className="overflow-x-auto my-2">
                            <Table striped>
                                <Table.Head>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Wilayah</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Tahun</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Jumlah Kecelakaan</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Meninggal</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Luka Berat</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Luka Ringan</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Kerugian</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Action</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {geodatas.data?.map((item: GeoDatas, key: number) => (
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={key}>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {item.wilayah}
                                            </Table.Cell>
                                            <Table.Cell>{item.tahun}</Table.Cell>
                                            <Table.Cell>{item.jumlah_kecelakaan}</Table.Cell>
                                            <Table.Cell>{item.meninggal}</Table.Cell>
                                            <Table.Cell>{item.luka_berat}</Table.Cell>
                                            <Table.Cell>{item.luka_ringan}</Table.Cell>
                                            <Table.Cell>{item.kerugian.toLocaleString()}</Table.Cell>
                                            <Table.Cell>
                                                <Link href={"/detaildata?id=" + item.id} className="hover:text-primary">
                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                        <div className="flex overflow-x-auto sm:justify-end mx-8">
                            <Pagination currentPage={currentFilter.page} totalPages={Math.ceil(geodatas.count / currentFilter.take)} onPageChange={onPageChange} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default DataComponent;