import React from "react";
// import ChartOne from "../Charts/ChartOne";
import CardDataStats from "../CardDataStats";
// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import Loader from "../common/Loader";
import { getEligibleReportCount, getReportCount, getUnprocessedReportCount } from "@/lib/prisma/reports";
// const MapOne = dynamic(() => import("../Maps/MapOne"), {
//   ssr: false,
// });

const DashboardComponent: React.FC = async () => {
    const { res: count, error: counterr } = await getReportCount();
    const { res: el_count, error: el_counterr } = await getEligibleReportCount();
    const { res: unproc_count, error: unprocerr } = await getUnprocessedReportCount();
    return (
        <>
            <div className="flex flex-col items-center max-w-screen-2xl mx-auto h-full w-full px-[2vw] sm:px-[5vw] lg:px-[8vw] py-5 sm:py-10 lg:py-15">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
                    {/* <CardDataStats title="Laporan bisa diproses" total={el_count?.toString() ?? ""} rate="">
                        <svg
                            className="fill-primary dark:fill-white"
                            width="22"
                            height="16"
                            viewBox="0 0 22 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                                fill=""
                            />
                            <path
                                d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                                fill=""
                            />
                        </svg>
                    </CardDataStats> */}
                    <CardDataStats title="Laporan bisa diproses" total={el_count?.toString() ?? ""} rate=""  >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 19.5H21" stroke="#3c50e0" strokeWidth="2.016" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11 12.5H21" stroke="#3c50e0" strokeWidth="2.016" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11 5.5H21" stroke="#3c50e0" strokeWidth="2.016" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3 5.5L4 6.5L7 3.5" stroke="#3c50e0" strokeWidth="2.016" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3 12.5L4 13.5L7 10.5" stroke="#3c50e0" strokeWidth="2.016" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3 19.5L4 20.5L7 17.5" stroke="#3c50e0" strokeWidth="2.016" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </CardDataStats>
                    <CardDataStats title="Laporan belum diproses" total={unproc_count?.toString() ?? ""} rate="" >
                        <svg fill="#000000" width="22" height="22" viewBox="0 0 24.00 24.00" id="report-pie-chart-5" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" className="icon line-color"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M16,17v3a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H15a1,1,0,0,1,1,1V7" fill="none" stroke="#3c50e0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16"></path><path id="secondary" d="M16,7a5,5,0,1,0,5,5A5,5,0,0,0,16,7Zm0,0v5l-3.54,3.54A5,5,0,0,1,16,7Z" fill="none" stroke="#3c50e0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16"></path></g></svg>
                    </CardDataStats>
                    <CardDataStats title="Total Laporan" total={count?.toString() ?? ""} rate="">
                        <svg fill="#3c50e0" width="22" height="22" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#3c50e0" strokeWidth="0.00032"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>report</title> <path d="M6 11h4v17h-4v-17zM22 16v12h4v-12h-4zM14 28h4v-24h-4v24z"></path> </g></svg>
                    </CardDataStats>
                </div>
                {/* <div className="mt-4 grid grid-cols-6 w-full gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne /> 
      </div> */}
            </div>
        </>
    );
};

export default DashboardComponent;
