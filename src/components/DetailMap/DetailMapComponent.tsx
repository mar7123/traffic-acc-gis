'use client'

import { GeoData } from "@prisma/client";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";

const DisableMap = () => {
    const map = useMap();
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    return null;
}

const DetailMapComponent = ({ data }: { data: GeoData }) => {
    return (
        <>
            <MapContainer
                center={[data.latitude, data.longitude]}
                zoom={16}
                scrollWheelZoom={true}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    draggable={false}
                    position={[data.latitude, data.longitude]}
                    icon={
                        new L.Icon({
                            iconUrl: MarkerIcon.src,
                            iconRetinaUrl: MarkerIcon.src,
                            iconSize: [25, 41],
                            iconAnchor: [12.5, 41],
                            popupAnchor: [0, -41],
                        })
                    }
                >
                </Marker>
                <DisableMap />
            </MapContainer>
        </>
    )
}
export default DetailMapComponent;