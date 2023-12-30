'use client';

import { Navbar, Button } from 'flowbite-react';
import { usePathname } from "next/navigation";


function NavbarComponent() {
    const scrollHeaderClick = () => {
        const element = document.getElementById("main-component");
        element?.scrollIntoView({ behavior: 'smooth' });
    };
    const pathname = usePathname();

    if (pathname == "/login") {
        return (null);
    }
    return (
        <>
            <div className={'min-h-fit flex items-center my-2'}>
                <Navbar className="w-full bg-transparent max-w-screen-2xl px-[4vw] sm:px-[4vw] lg:px-[7vw] text-white mx-auto" fluid rounded>
                    <Navbar.Brand href="/">
                        <svg className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]' viewBox="0 0 24 24" fill="none" stroke='white' xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.861 3.16338C17.9137 3.18096 17.967 3.19877 18.0211 3.2168L19.2231 3.61748C19.6863 3.77182 20.0922 3.9071 20.4142 4.05691C20.7623 4.21887 21.0814 4.42748 21.3253 4.76588C21.5692 5.10428 21.6662 5.47292 21.7098 5.85441C21.7501 6.20729 21.75 6.63515 21.75 7.12331V15.3359C21.75 16.0343 21.75 16.6234 21.6959 17.089C21.6397 17.5728 21.5136 18.0511 21.161 18.4369C20.9519 18.6658 20.6978 18.8489 20.4146 18.9749C19.9371 19.1874 19.4435 19.1557 18.9667 19.0561C18.5078 18.9602 17.949 18.7739 17.2865 18.5531L17.2438 18.5388C16.1233 18.1653 15.7393 18.049 15.3665 18.0617C15.218 18.0668 15.0703 18.0865 14.9257 18.1207C14.5627 18.2065 14.2229 18.4198 13.2401 19.075L11.8577 19.9966C11.8103 20.0282 11.7635 20.0594 11.7173 20.0903C10.6558 20.7988 9.91754 21.2915 9.05448 21.4071C8.19141 21.5227 7.3495 21.2416 6.13896 20.8373C6.08632 20.8197 6.03298 20.8019 5.97892 20.7839L4.77683 20.3832C4.31373 20.2288 3.90783 20.0936 3.5858 19.9438C3.23766 19.7818 2.91861 19.5732 2.67471 19.2348C2.4308 18.8964 2.33379 18.5278 2.29024 18.1463C2.24995 17.7934 2.24997 17.3655 2.25 16.8774L2.25 8.66478C2.24998 7.96634 2.24996 7.37729 2.3041 6.91163C2.36035 6.42784 2.48645 5.94957 2.83896 5.56377C3.04807 5.33491 3.30221 5.15174 3.58544 5.02573C4.06293 4.81331 4.55653 4.84493 5.03328 4.94455C5.49217 5.04044 6.05097 5.22673 6.71356 5.44762L6.75619 5.46183C7.87675 5.83535 8.26073 5.95172 8.63351 5.93899C8.78204 5.93392 8.9297 5.91415 9.07432 5.87996C9.43731 5.79415 9.77714 5.58086 10.7599 4.92565L12.1423 4.00407C12.1897 3.97246 12.2365 3.94124 12.2827 3.91043C13.3442 3.2019 14.0825 2.70913 14.9455 2.59355C15.8086 2.47797 16.6505 2.75913 17.861 3.16338ZM15.75 4.10577V16.5796C16.2857 16.6377 16.8498 16.826 17.5931 17.0741C17.6342 17.0878 17.6759 17.1017 17.7182 17.1158C18.4348 17.3547 18.9103 17.5119 19.2735 17.5878C19.6287 17.6621 19.7505 17.6286 19.8049 17.6044C19.8993 17.5624 19.984 17.5014 20.0537 17.4251C20.0938 17.3812 20.164 17.2762 20.2059 16.9158C20.2488 16.5472 20.25 16.0464 20.25 15.291V7.16261C20.25 6.62355 20.2489 6.28223 20.2195 6.02455C20.1922 5.78604 20.1477 5.69737 20.1084 5.64294C20.0692 5.58851 19.9992 5.51821 19.7815 5.41695C19.5464 5.30755 19.2229 5.19854 18.7115 5.02808L17.5467 4.63982C16.6604 4.34437 16.1345 4.17626 15.75 4.10577ZM14.25 16.7599V4.43371C13.9388 4.61353 13.5397 4.87528 12.9744 5.25214L11.592 6.17373C11.5549 6.19844 11.5184 6.22284 11.4823 6.24691C10.794 6.70619 10.281 7.04856 9.75 7.24073V19.567C10.0612 19.3871 10.4603 19.1254 11.0256 18.7485L12.408 17.8269C12.4451 17.8022 12.4816 17.7778 12.5177 17.7538C13.206 17.2945 13.719 16.9521 14.25 16.7599ZM8.25 19.8949V7.42108C7.71431 7.36301 7.15021 7.17471 6.40693 6.92659C6.36579 6.91286 6.32411 6.89894 6.28185 6.88485C5.5652 6.64597 5.08969 6.48874 4.72647 6.41284C4.37129 6.33862 4.2495 6.37205 4.19515 6.39623C4.10074 6.43823 4.01603 6.49929 3.94632 6.57557C3.9062 6.61949 3.83597 6.72446 3.79406 7.08488C3.75121 7.45346 3.75 7.9543 3.75 8.7097V16.8381C3.75 17.3771 3.75114 17.7184 3.78055 17.9761C3.80779 18.2146 3.85234 18.3033 3.89157 18.3577C3.9308 18.4122 4.00083 18.4825 4.21849 18.5837C4.45364 18.6931 4.77709 18.8021 5.28849 18.9726L6.45326 19.3609C7.33961 19.6563 7.86547 19.8244 8.25 19.8949Z" fill="#1C274C" />
                        </svg>
                        <span className="ml-2 self-center whitespace-nowrap text-md sm:text-2xl font-semibold dark:text-white">TRASK</span>
                    </Navbar.Brand>
                    <div className="flex md:order-2">
                        <Button href="/" className="custom-link bg-transparent focus:ring-0 text-white">
                            <span className="text-md mx-0 sm:mx-4">Kontak Kami</span>
                        </Button>
                        <Navbar.Toggle />
                    </div>
                    <Navbar.Collapse theme={{list:"mt-4 flex flex-col absolute top-[60px] left-0 bg-black w-screen md:w-fit md:static md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium"}}>
                        <Button href="/" className={`custom-link bg-transparent focus:ring-0 hover:text-white text-gray-400 ${pathname == '/' && "text-white"}`}>
                            <span className="text-md mx-4">Beranda</span>
                        </Button>
                        <Button href="/map?mode=view" className={`custom-link bg-transparent focus:ring-0 hover:text-white text-gray-400 ${pathname.includes("/map") && "text-white"}`}>
                            <span className="text-md mx-4">Peta</span>
                        </Button>
                        <Button href="/data" className={`custom-link bg-transparent focus:ring-0 hover:text-white text-gray-400 ${pathname == "/data" && "text-white"}`}>
                            <span className="text-md mx-4">Data</span>
                        </Button>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            {pathname == "/" ? (
                <div className='h-[92vh] px-[4vw] sm:px-[4vw] md:px-[7vw] sm:max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-0 content-center mx-auto'>
                    <div className='p-12'>
                        <h1 className="text-2xl sm:text-4xl xl:text-6xl font-bold text-white mb-4">TRASK GIS</h1>
                        <h2 className="text-sm sm:text-md xl:text-lg font-bold text-white mb-4">Traffic Accident Risk Geographic Information System</h2>
                        <p className="text-md sm:text-lg md:text-xl text-white">TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan. Data dikumpulkan berdasarkan kejadian kecelakaan yang terjadi pada beberapa kota.</p>
                        <Button type='submit' color='mt-4 py-1 bg-transparent hover:bg-white border-white hover:text-black w-full md:w-auto md:inline-block py-1 font-semibold text-white' onClick={scrollHeaderClick} className="mt-4 py-1 bg-transparent hover:bg-white border-white border-2 hover:text-black w-full md:w-auto md:inline-block py-1 font-semibold text-white">
                            Mulai
                        </Button>
                    </div>
                </div>
            ) : (null)}
        </>
    );
}

export default NavbarComponent;




