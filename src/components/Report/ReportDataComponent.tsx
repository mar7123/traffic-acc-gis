'use client';

import Loader from "@/components/common/Loader";
import { Button, Modal, Select, Table, TextInput } from 'flowbite-react';
import Link from "next/link";
import { Pagination } from 'flowbite-react';
import { useEffect, useState } from "react";
import { Reports } from "@prisma/client";
import ModalComponent from "@/components/Modal/ModalComponent";

type ReportsMod = Omit<Reports, 'datetime_crash'> & {
    datetime_crash: string,
    geoloc: {
        name2: string
    }
}

function ReportDataComponent() {
    const [loading, setLoading] = useState<boolean>(true);

    const [optModal, setOptModal] = useState<{
        open: boolean,
        status: "success" | "error",
        message: string
    }>({
        open: false,
        status: "success",
        message: ""
    });
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean,
        geodata_id: string
    }>({
        open: false,
        geodata_id: ""
    });


    // Fetch Data
    const [reports, setReports] = useState<{ data: ReportsMod[], count: number }>({ data: [], count: 0 });

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
    const reportAPI = async () => {
        const res = await fetch('/api/report?' + new URLSearchParams({
            take: currentFilter.take.toString(),
            page: currentFilter.page.toString()
        }), {
            method: "GET",
            cache: "no-store"
        })
        const { data, count } = await res.json();
        if (data.length == 0 && (currentFilter.page - 1) * currentFilter.take <= count) {
            setCurrentFilter({ ...currentFilter, page: Math.ceil(count / currentFilter.take), toggle: !currentFilter.toggle })
            return;
        }
        console.log(data)
        setReports({ data: data, count: count });
        setLoading(false);
    }
    const reportSearch = async () => {
        const res = await fetch('/api/report/search?' + new URLSearchParams({
            filter: currentFilter.search,
            take: currentFilter.take.toString(),
            page: currentFilter.page.toString()
        }), {
            method: "GET",
        })
        const { data, count }: { data: ReportsMod[], count: number } = await res.json()
        setReports({ data: data, count: count });
        setLoading(false);
    }
    const reportDelete = async (id: string) => {
        const res = await fetch('/api/report/delete', {
            method: "POST",
            body: JSON.stringify({ id: id })
        })
        if (res.status == 200) {
            setCurrentFilter({ ...currentFilter, toggle: !currentFilter.toggle })
        }
        setDeleteModal({ ...deleteModal, open: false })
    }
    const setModal = ({ open, status, message }: { open: boolean, status: "success" | "error", message: string }) => {
        setOptModal({ open: open, status: status, message: message });
    }


    // Mount
    useEffect(() => {
        setLoading(true)
        if (currentFilter.mode == "search") {
            reportSearch()
        }
        if (currentFilter.mode == "default") {
            reportAPI()
        }
    }, [currentFilter.toggle])

    return (
        <>
            <div className="flex max-w-full w-full sm:w-5/6 gap-2 my-2">
                <ModalComponent optModal={optModal} setModal={setModal} />
                <div className="w-9/12">
                    <TextInput id="search-bar" type="text" placeholder="Magelang..." value={currentFilter.search} onChange={({ target }) => { setCurrentFilter({ ...currentFilter, search: target.value }) }} onKeyDown={(e: any) => {
                        if (e.key == "Enter") {
                            if (currentFilter.search == "") {
                                setCurrentFilter({ ...currentFilter, mode: "default", toggle: !currentFilter.toggle, page: 1 });
                                return;
                            } else if (currentFilter.search.length <= 3) {
                                setOptModal({ message: "Masukan 4 karakter atau lebih", status: "error", open: true })
                                return;
                            }
                            setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 });
                        }
                    }} />
                </div>
                <Button type="submit" color="bg-black text-white hover:bg-opacity-80" className="w-3/12 bg-black text-white hover:bg-opacity-80" onClick={(e: any) => {
                    if (currentFilter.search == "") {
                        setCurrentFilter({ ...currentFilter, mode: "default", toggle: !currentFilter.toggle, page: 1 });
                        return;
                    } else if (currentFilter.search.length <= 3) {
                        setOptModal({ message: "Masukan 4 karakter atau lebih", status: "error", open: true })
                        return;
                    }
                    setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 });
                }}>
                    Cari
                </Button>
            </div>
            <div className="flex justify-between h-fit w-full my-2 px-2">
                <Button color="bg-black text-white hover:bg-opacity-80" as="a" className="bg-black text-white hover:bg-opacity-80" href="/database/add">Add Data</Button>
                <Select id="year" value={currentFilter.take} onChange={(e) => {
                    setCurrentFilter({ ...currentFilter, take: Number(e.target.value), toggle: !currentFilter.toggle, page: 1 });
                }} required>
                    <option key={10} value={10}>{10}</option>
                    <option key={25} value={25}>{25}</option>
                    <option key={50} value={50}>{50}</option>
                </Select>
            </div>
            <div className="relative min-h-[96px] w-full">
                {loading ? (<Loader />) : (
                    <>
                        <div className="overflow-x-auto my-2">
                            <Modal className="z-9999" show={deleteModal.open} size="md" onClose={() => setDeleteModal({ ...deleteModal, open: false })} dismissible>
                                <Modal.Header />
                                <Modal.Body>
                                    <div className="text-center">
                                        <svg className="mx-auto mb-3" width="64px" height="64px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fillRule="evenodd" fill="#000000"></path></g></svg>                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                            Apa anda ingin menghapus data kecelakaan tersebut?
                                        </h3>
                                        <div className="flex justify-center gap-4">
                                            <Button color="failure" onClick={() => reportDelete(deleteModal.geodata_id)}>
                                                {"Ya"}
                                            </Button>
                                            <Button color="gray" onClick={() => setDeleteModal({ ...deleteModal, open: false })}>
                                                Tidak
                                            </Button>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                            <Table striped>
                                <Table.Head >
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Wilayah</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Nama</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Waktu</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Latitude</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Longitude</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Jumlah Kecelakaan</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Sudah Diproses</Table.HeadCell>
                                    <Table.HeadCell className="bg-black text-white dark:bg-white dark:text-black">Action</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {reports.data?.map((item: ReportsMod, key: number) => (
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={key}>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {item.geoloc?.name2}
                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {item.name}
                                            </Table.Cell>
                                            <Table.Cell>{item.datetime_crash}</Table.Cell>
                                            <Table.Cell>{item.latitude}</Table.Cell>
                                            <Table.Cell>{item.longitude}</Table.Cell>
                                            <Table.Cell>{item.jumlah_kecelakaan}</Table.Cell>
                                            <Table.Cell>{item.processed ? "True" : "False"}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex w-fit gap-2 items-center">
                                                    <button onClick={(e: any) => (setDeleteModal({ open: true, geodata_id: item.id }))} className="hover:text-primary">
                                                        <svg
                                                            className="fill-current"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 18 18"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                                fill=""
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                        <div className="flex overflow-x-auto sm:justify-end mx-8">
                            <Pagination currentPage={currentFilter.page} totalPages={Math.ceil(reports.count / currentFilter.take)} onPageChange={onPageChange} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default ReportDataComponent;