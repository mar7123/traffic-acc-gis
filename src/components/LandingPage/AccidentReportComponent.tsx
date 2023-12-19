'use client';

import { Button } from 'flowbite-react';

function AccidentReportComponent() {
    return (
        <div className="flex w-full h-full items-center gap-4">
            <div className='flex flex-col w-full h-fit items-center'>
                <h5 className="w-full text-4xl md:text-6xl font-bold text-white dark:text-white text-center mb-10">
                    Traffic Accident Reporting System
                </h5>
                <p className="px-15 font-normal text-gray-400 dark:text-gray-700 indent-10 text-justify mb-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui sapien eget mi proin sed. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Euismod nisi porta lorem mollis aliquam. Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Tortor dignissim convallis aenean et tortor at risus viverra adipiscing. Scelerisque felis imperdiet proin fermentum. Egestas sed sed risus pretium quam vulputate dignissim. Quis auctor elit sed vulputate. Elit duis tristique sollicitudin nibh sit. Consectetur adipiscing elit pellentesque habitant morbi. Varius morbi enim nunc faucibus a pellentesque sit amet.
                </p>
                <Button type="submit" href='/map?mode=report' className="bg-transparent border-white hover:bg-white hover:text-black w-full md:w-auto md:inline-block py-1 font-semibold text-white">File Report</Button>
            </div>
        </div>
    );
}

export default AccidentReportComponent;
