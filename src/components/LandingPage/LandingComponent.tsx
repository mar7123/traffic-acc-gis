import React from 'react';
import CardComponent from '@/components/LandingPage/CardComponent';
import AccidentReportComponent from '@/components/LandingPage/AccidentReportComponent';

function LandingComponent() {
    return (
        <div className='h-fit w-full bg-gray-100'>
            <div className='min-h-screen max-h-screen w-full max-w-screen-2xl flex items-center px-[3vw] sm:px-[7vw] lg:px-[15vw] py-auto bg-gray-100 mx-auto'>
                <CardComponent />
            </div>
            <div className='h-screen min-h-fit flex items-center bg-fixed bg-no-repeat bg-top bg-[#1A1511]' style={{ backgroundImage: "url('/assets/bg/bgreportfixed.jpg')",  backfaceVisibility: "hidden", backgroundSize:"98%" }}>
                <div className="h-full w-full min-h-fit mx-auto sm:px-[7vw] lg:px-[15vw] py-auto backdrop-brightness-50 bg-blue/50">
                    <AccidentReportComponent />
                </div>
            </div>
        </div>
    );
};
export default LandingComponent;

