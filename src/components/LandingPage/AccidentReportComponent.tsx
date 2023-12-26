'use client';

import { Button } from 'flowbite-react';

function AccidentReportComponent() {
    return (
        <div className="flex w-full h-full max-w-screen-2xl mx-auto items-center gap-4">
            <div className='flex flex-col w-full h-fit items-center mx-4'>
                <h5 className="w-full text-2xl sm:text-4xl md:text-6xl font-bold text-white dark:text-white text-center mb-5 sm:mb-10">
                    Sistem Pelaporan Kejadian Kecelakaan
                </h5>
                <p className="text-sm sm:text-md md:text-xl px-0 sm:px-15 font-normal text-gray-400 dark:text-gray-700 indent-10 text-justify mb-10 sm:mb-20">
                    Kami memahami betapa pentingnya informasi cepat dan akurat dalam menangani kecelakaan lalu lintas. Dengan platform kami, Anda dapat dengan mudah melaporkan kejadian kecelakaan, memastikan kualitas hasil analisis sistem informasi geografis yang dibuat. Proses pelaporan yang sederhana dan cepat, memungkinkan Anda untuk memberikan detail kejadian dengan mudah dan akurat. Kami menyediakan formulir yang intuitif untuk meminimalkan waktu dan usaha Anda.
                </p>
                <Button type="submit" href='/map?mode=report' className="bg-transparent border-white hover:bg-white hover:text-black w-full md:w-auto md:inline-block py-1 font-semibold text-white">Buat Laporan</Button>
            </div>
        </div>
    );
}

export default AccidentReportComponent;
