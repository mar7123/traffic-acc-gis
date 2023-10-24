import MapComponent from "@/components/Map/MapComponent";
import { getAccidentsByState, getAccidents } from "../../../lib/prisma/accidents";

async function getAcc() {
  const { acc: res } = await getAccidents(2021, 5, 6);
  return res;
}

async function Gismap() {
  const accdata = await getAcc();
  return (
    <main>
      <MapComponent markerdata={accdata} />
    </main>
  );
}

export default Gismap;
