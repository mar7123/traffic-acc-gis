'use client';

import React from 'react';
import { Button, Card } from 'flowbite-react';
import Image from "next/image";

function CardComponent() {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 content-center'>
            <Card className='w-5/6 h-full justify-self-center items-center hidden lg:flex'
                renderImage={() => <Image className='my-8' width={180} height={180} src="/assets/cardimg1.svg" alt="image 1" />}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Pemetaan Data
                </h5>
            </Card>
            <Card className='w-5/6 h-full justify-self-center items-center lg:text-md sm:text-sm'
                renderImage={() => <Image className='my-4 lg:hidden sm:block' width={100} height={100} src="/assets/cardimg1.svg" alt="image 1" />}>
                <h5 className="text-md sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Eksplorasi Peta
                </h5>
                <p className="text-sm sm:text-md font-normal text-gray-700 dark:text-gray-400">
                    Jelajahi peta interaktif yang memberikan gambaran detail tentang daerah risiko dan zona rawan kecelakaan lalu lintas.
                </p>
                <Button href='/map?mode=view' className='text-white bg-black'>
                    Peta
                    <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Button>
            </Card>
            <Card className='w-5/6 h-full justify-self-center items-center lg:text-md sm:text-sm'
                renderImage={() => <Image className='my-4 lg:hidden sm:block' width={100} height={100} src="/assets/cardimg2.svg" alt="image 1" />}>
                <h5 className="text-md sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Lihat Detail
                </h5>
                <p className="text-sm sm:text-md font-normal text-gray-700 dark:text-gray-400">
                    Temukan kedalaman informasi terkait risiko kecelakaan lalu lintas dengan detil yang mengagumkan.
                </p>
                <Button href='/data' className='text-white bg-black'>
                    Data
                    <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Button>
            </Card>
            <Card className='w-5/6 h-full justify-self-center items-center hidden lg:flex'
                renderImage={() => <Image className='my-4' width={180} height={180} src="/assets/cardimg2.svg" alt="image 1" />}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Akses Data
                </h5>
            </Card>
        </div>
    );
};

export default CardComponent;
