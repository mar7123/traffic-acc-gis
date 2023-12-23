import Link from "next/link";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { Session } from "next-auth";

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
    session: Session | null
}) => {
    return (
        <header className="sticky top-0 z-1200 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
                        <span className="relative block h-5.5 w-5.5 cursor-pointer">
                            <span className="du-block absolute right-0 h-full w-full">
                                <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-300"
                                        }`}
                                ></span>
                                <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "delay-400 !w-full"
                                        }`}
                                ></span>
                                <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-500"
                                        }`}
                                ></span>
                            </span>
                            <span className="absolute right-0 h-full w-full rotate-45">
                                <span
                                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-[0]"
                                        }`}
                                ></span>
                                <span
                                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-200"
                                        }`}
                                ></span>
                            </span>
                        </span>
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}

                    <Link className="block flex-shrink-0 lg:hidden" href="/">
                        <svg width="40px" height="40px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="1.2"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.43627 5.14686C2 5.64345 2 6.49488 2 8.19773V17.591C2 18.797 2 19.4 2.3146 19.854C2.62919 20.3079 3.17921 20.4986 4.27924 20.88L5.57343 21.3286C6.27436 21.5717 6.81371 21.7586 7.26633 21.879C7.5616 21.9576 7.83333 21.7258 7.83333 21.4203V6.2701C7.83333 6.02118 7.64964 5.81111 7.40837 5.74991C7.01914 5.65118 6.55127 5.48897 5.91002 5.26666C4.35676 4.72817 3.58014 4.45893 2.98922 4.73235C2.77941 4.82942 2.59116 4.97054 2.43627 5.14686Z" fill="#ffffff"></path> <path d="M12.6204 3.48096L11.0844 4.54596C10.5287 4.93124 10.1215 5.2136 9.77375 5.41491C9.60895 5.51032 9.5 5.68291 9.5 5.87334V20.9203C9.5 21.2909 9.88398 21.5222 10.1962 21.3225C10.5312 21.1082 10.9149 20.8422 11.3796 20.5199L12.9156 19.4549C13.4712 19.0697 13.8785 18.7873 14.2262 18.586C14.3911 18.4906 14.5 18.318 14.5 18.1276V3.08063C14.5 2.71004 14.116 2.47866 13.8038 2.67836C13.4688 2.89271 13.0851 3.15874 12.6204 3.48096Z" fill="#ffffff"></path> <path d="M19.7208 3.12093L18.4266 2.67226C17.7256 2.42923 17.1863 2.24228 16.7337 2.12187C16.4384 2.04333 16.1667 2.2751 16.1667 2.58064V17.7308C16.1667 17.9797 16.3504 18.1898 16.5916 18.251C16.9809 18.3497 17.4488 18.5119 18.09 18.7342C19.6432 19.2727 20.4199 19.542 21.0108 19.2686C21.2206 19.1715 21.4088 19.0304 21.5637 18.854C22 18.3575 22 17.506 22 15.8032V6.40988C22 5.2039 22 4.60091 21.6854 4.14695C21.3708 3.69298 20.8208 3.5023 19.7208 3.12093Z" fill="#ffffff"></path> </g></svg>
                    </Link>
                </div>

                <div className="hidden sm:block">
                    {/* <form action=" " method="POST"> */}
                    <div className="relative">
                        <button className="absolute left-0 top-1/2 -translate-y-1/2">

                        </button>
                    </div>
                    {/* </form> */}
                </div>

                <div className="flex items-center gap-3 2xsm:gap-7 ">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        <li>
                            {/* <!-- Dark Mode Toggler --> */}
                            {/* <!-- Dark Mode Toggler --> */}
                        </li>
                        <li>
                            {/* <!-- User Area --> */}
                            <DropdownUser session={props.session} />
                            {/* <!-- User Area --> */}
                        </li>

                    </ul>


                </div>
            </div>
        </header>
    );
};

export default Header;
