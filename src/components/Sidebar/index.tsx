import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    let storedSidebarExpanded = "true";
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document.querySelector("body")?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <Link className="mb-5.5 flex" href="/">
                    <svg width="35px" height="35px" viewBox="0 0 24 24" fill="white" stroke='white' xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="nonzero" clipRule="evenodd" d="M17.861 3.16338C17.9137 3.18096 17.967 3.19877 18.0211 3.2168L19.2231 3.61748C19.6863 3.77182 20.0922 3.9071 20.4142 4.05691C20.7623 4.21887 21.0814 4.42748 21.3253 4.76588C21.5692 5.10428 21.6662 5.47292 21.7098 5.85441C21.7501 6.20729 21.75 6.63515 21.75 7.12331V15.3359C21.75 16.0343 21.75 16.6234 21.6959 17.089C21.6397 17.5728 21.5136 18.0511 21.161 18.4369C20.9519 18.6658 20.6978 18.8489 20.4146 18.9749C19.9371 19.1874 19.4435 19.1557 18.9667 19.0561C18.5078 18.9602 17.949 18.7739 17.2865 18.5531L17.2438 18.5388C16.1233 18.1653 15.7393 18.049 15.3665 18.0617C15.218 18.0668 15.0703 18.0865 14.9257 18.1207C14.5627 18.2065 14.2229 18.4198 13.2401 19.075L11.8577 19.9966C11.8103 20.0282 11.7635 20.0594 11.7173 20.0903C10.6558 20.7988 9.91754 21.2915 9.05448 21.4071C8.19141 21.5227 7.3495 21.2416 6.13896 20.8373C6.08632 20.8197 6.03298 20.8019 5.97892 20.7839L4.77683 20.3832C4.31373 20.2288 3.90783 20.0936 3.5858 19.9438C3.23766 19.7818 2.91861 19.5732 2.67471 19.2348C2.4308 18.8964 2.33379 18.5278 2.29024 18.1463C2.24995 17.7934 2.24997 17.3655 2.25 16.8774L2.25 8.66478C2.24998 7.96634 2.24996 7.37729 2.3041 6.91163C2.36035 6.42784 2.48645 5.94957 2.83896 5.56377C3.04807 5.33491 3.30221 5.15174 3.58544 5.02573C4.06293 4.81331 4.55653 4.84493 5.03328 4.94455C5.49217 5.04044 6.05097 5.22673 6.71356 5.44762L6.75619 5.46183C7.87675 5.83535 8.26073 5.95172 8.63351 5.93899C8.78204 5.93392 8.9297 5.91415 9.07432 5.87996C9.43731 5.79415 9.77714 5.58086 10.7599 4.92565L12.1423 4.00407C12.1897 3.97246 12.2365 3.94124 12.2827 3.91043C13.3442 3.2019 14.0825 2.70913 14.9455 2.59355C15.8086 2.47797 16.6505 2.75913 17.861 3.16338ZM15.75 4.10577V16.5796C16.2857 16.6377 16.8498 16.826 17.5931 17.0741C17.6342 17.0878 17.6759 17.1017 17.7182 17.1158C18.4348 17.3547 18.9103 17.5119 19.2735 17.5878C19.6287 17.6621 19.7505 17.6286 19.8049 17.6044C19.8993 17.5624 19.984 17.5014 20.0537 17.4251C20.0938 17.3812 20.164 17.2762 20.2059 16.9158C20.2488 16.5472 20.25 16.0464 20.25 15.291V7.16261C20.25 6.62355 20.2489 6.28223 20.2195 6.02455C20.1922 5.78604 20.1477 5.69737 20.1084 5.64294C20.0692 5.58851 19.9992 5.51821 19.7815 5.41695C19.5464 5.30755 19.2229 5.19854 18.7115 5.02808L17.5467 4.63982C16.6604 4.34437 16.1345 4.17626 15.75 4.10577ZM14.25 16.7599V4.43371C13.9388 4.61353 13.5397 4.87528 12.9744 5.25214L11.592 6.17373C11.5549 6.19844 11.5184 6.22284 11.4823 6.24691C10.794 6.70619 10.281 7.04856 9.75 7.24073V19.567C10.0612 19.3871 10.4603 19.1254 11.0256 18.7485L12.408 17.8269C12.4451 17.8022 12.4816 17.7778 12.5177 17.7538C13.206 17.2945 13.719 16.9521 14.25 16.7599ZM8.25 19.8949V7.42108C7.71431 7.36301 7.15021 7.17471 6.40693 6.92659C6.36579 6.91286 6.32411 6.89894 6.28185 6.88485C5.5652 6.64597 5.08969 6.48874 4.72647 6.41284C4.37129 6.33862 4.2495 6.37205 4.19515 6.39623C4.10074 6.43823 4.01603 6.49929 3.94632 6.57557C3.9062 6.61949 3.83597 6.72446 3.79406 7.08488C3.75121 7.45346 3.75 7.9543 3.75 8.7097V16.8381C3.75 17.3771 3.75114 17.7184 3.78055 17.9761C3.80779 18.2146 3.85234 18.3033 3.89157 18.3577C3.9308 18.4122 4.00083 18.4825 4.21849 18.5837C4.45364 18.6931 4.77709 18.8021 5.28849 18.9726L6.45326 19.3609C7.33961 19.6563 7.86547 19.8244 8.25 19.8949Z" fill="#1C274C" />
                    </svg>
                    <span className="ml-2 self-center text-white whitespace-nowrap text-2xl font-semibold dark:text-white">TARGIS Admin</span>
                </Link>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                            MENU
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">

                            {/* <!-- Menu Item Tables --> */}
                            <li>
                                <Link
                                    href="/"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname == "/" && "bg-graydark dark:bg-meta-4"
                                        }`}
                                >
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                                            fill=""
                                        />
                                        <path
                                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                                            fill=""
                                        />
                                        <path
                                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                                            fill=""
                                        />
                                        <path
                                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                                            fill=""
                                        />
                                    </svg>
                                    Dashboard
                                </Link>
                            </li>
                            {/* <!-- Menu Item Tables --> */}
                            {/* <!-- Menu Item Tables --> */}
                            <li>
                                <Link
                                    href="/map"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("map") && "bg-graydark dark:bg-meta-4"
                                        }`}
                                >
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_130_9756)">
                                            <path
                                                d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                                fill=""
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_130_9756">
                                                <rect
                                                    width="18"
                                                    height="18"
                                                    fill="white"
                                                    transform="translate(0 0.052124)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    Map
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/database"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("database") && "bg-graydark dark:bg-meta-4"
                                        }`}
                                >
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="19"
                                        viewBox="0 0 18 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_130_9756)">
                                            <path
                                                d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                                fill=""
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_130_9756">
                                                <rect
                                                    width="18"
                                                    height="18"
                                                    fill="white"
                                                    transform="translate(0 0.052124)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    Database
                                </Link>
                            </li>
                            {/* <!-- Menu Item Tables --> */}
                        </ul>
                    </div>

                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default Sidebar;
