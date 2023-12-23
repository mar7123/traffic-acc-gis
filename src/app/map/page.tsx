import dynamic from 'next/dynamic'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Map | TARGIS',
    description: 'TARGIS is a geographic information system for capturing, storing, checking, and displaying data related to traffic accidents',
}

const MapComp = dynamic(() => import('@/components/Map/MapComponent'), { ssr: false });

async function Map() {
    return (
        <div className='w-full'>
            <MapComp />
        </div>
    );
}

export default Map;
