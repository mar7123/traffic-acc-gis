import dynamic from 'next/dynamic'
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: 'Map | TRASK',
    description: 'TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan',
}

const viewport: Viewport = {
    width: "600",
    interactiveWidget: "overlays-content"
}
export { viewport };

const MapComp = dynamic(() => import('@/components/Map/MapComponent'), { ssr: false });

async function Map() {
    return (
        <div className='w-full'>
            <MapComp />
        </div>
    );
}

export default Map;
