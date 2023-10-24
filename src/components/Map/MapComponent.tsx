"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import MarkerShadow from "leaflet/dist/images/marker-shadow.png";

const MapComponent = (props: any) => {
  const mrkdata = props.markerdata;
  console.log(mrkdata);
  return (
    <div>
      <MapContainer
        center={[41.947701, -99.560052]}
        zoom={5}
        scrollWheelZoom={true}
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mrkdata.map((row: any) => (
          <Marker
            icon={
              new L.Icon({
                iconUrl: MarkerIcon.src,
                iconRetinaUrl: MarkerIcon.src,
                iconSize: [25, 41],
                iconAnchor: [12.5, 41],
                popupAnchor: [0, -41],
                // shadowUrl: MarkerShadow.src,
                // shadowSize: [41, 41],
              })
            }
            position={[row.LATITUDE, row.LONGITUD]}
          >
            <Popup>
              {row.ST_CASE} <br /> {row.DATETIME_CRASH.toISOString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
