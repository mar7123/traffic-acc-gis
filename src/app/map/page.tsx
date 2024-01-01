import dynamic from 'next/dynamic'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Map | TRASK',
    description: 'TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan',
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
