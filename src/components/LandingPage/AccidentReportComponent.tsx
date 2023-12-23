'use client';

import { Button } from 'flowbite-react';

function AccidentReportComponent() {
    return (
        <div className="flex w-full h-full max-w-screen-2xl mx-auto items-center gap-4">
            <div className='flex flex-col w-full h-fit items-center mx-4'>
                <h5 className="w-full text-2xl sm:text-4xl md:text-6xl font-bold text-white dark:text-white text-center mb-5 sm:mb-10">
                    Traffic Accident Reporting System
                </h5>
                <p className="text-sm sm:text-md md:text-xl px-0 sm:px-15 font-normal text-gray-400 dark:text-gray-700 indent-10 text-justify mb-10 sm:mb-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui sapien eget mi proin sed. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Euismod nisi porta lorem mollis aliquam. Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Tortor dignissim convallis aenean et tortor at risus viverra adipiscing. Scelerisque felis imperdiet proin fermentum. Egestas sed sed risus pretium quam vulputate dignissim. Quis auctor elit sed vulputate. Elit duis tristique sollicitudin nibh sit. Consectetur adipiscing elit pellentesque habitant morbi. Varius morbi enim nunc faucibus a pellentesque sit amet.
                </p>
                <Button type="submit" href='/map?mode=report' className="bg-transparent border-white hover:bg-white hover:text-black w-full md:w-auto md:inline-block py-1 font-semibold text-white">File Report</Button>
            </div>
        </div>
    );
}

export default AccidentReportComponent;
