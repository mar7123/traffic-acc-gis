"use client";

import Loader from "@/components/common/Loader";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { Dropdown } from 'flowbite-react';
import { useEffect, useState } from "react";

interface Geolocs {
    id: String,
    geoId: number,
    geoId2?: number,
    name: string,
    name2?: string,
    geojs: GeoJSON.GeoJsonObject,
    color?: string,
    agregate: {
        geoloc_id: string,
        _sum: {
            jumlah_kecelakaan: number,
        }
    }[],
    geodatas: GeoDatas[]
}
interface GeoDatas {
    id: String,
    wilayah: string,
    tahun: number,
    jumlah_kecelakaan: number,
    meninggal: number,
    luka_berat: number,
    luka_ringan: number,
    kerugian: number,
}
const MapComponent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [geolocs, setGeolocs] = useState<Geolocs[]>([]);
    const [yearDD, setYearDD] = useState<{ tahun: number }[]>([]);
    const [filters, setFilters] = useState<{
        year: number,
        count: number,
        mean: number,
        std: number,
        n: number,
        upper: {
            val: number,
            exist: boolean
        },
        lower: {
            val: number,
            exist: boolean
        },
        toggle: boolean
    }>({
        year: 0,
        count: 0,
        mean: 0,
        std: 0,
        n: 0,
        upper: {
            val: 0,
            exist: false,
        },
        lower: {
            val: 0,
            exist: false,
        },
        toggle: true
    });

    const mean = (data: Geolocs[], calc: { count: number, mean: number }) => {
        let count = 0;
        let sum = 0;
        data.forEach((elem) => {
            if (elem.agregate.length == 1) {
                count += 1;
                sum += elem.agregate[0]?._sum.jumlah_kecelakaan;
            }
        });
        if (count != 0) {
            calc.count = count;
            calc.mean = sum / count;
        }
    }

    const std = (data: Geolocs[], calc: { count: number, mean: number, std: number }) => {
        let sum = 0;
        data.forEach((elem) => {
            if (elem.agregate.length == 1) {
                sum += Math.pow(elem.agregate[0]?._sum.jumlah_kecelakaan - calc.mean, 2);
            }
        });
        if (calc.count != 0) {
            calc.std = Math.sqrt(sum / (calc.count - 1));
        }
    }

    const assignColor = (data: Geolocs[], calc: { mean: number, upper: { val: number, exist: boolean }, lower: { val: number, exist: boolean } }) => {
        const result = data.map((elem) => {
            if (elem.agregate.length == 1) {
                if (elem.agregate[0]?._sum.jumlah_kecelakaan > calc.upper.val) {
                    calc.upper.exist = true;
                    elem.color = "red";
                    return elem;
                }
                if (elem.agregate[0]?._sum.jumlah_kecelakaan < calc.lower.val) {
                    calc.lower.exist = true;
                    elem.color = "green";
                    return elem;
                }
                if (elem.agregate[0]?._sum.jumlah_kecelakaan >= calc.lower.val && elem.agregate[0]?._sum.jumlah_kecelakaan <= calc.upper.val) {
                    elem.color = "yellow";
                    return elem;
                }
            }
            return elem;
        });
        return result;
    }

    const calculate = (data: Geolocs[], calc_var: { mean: number, std: number, n: number, upper: { val: number, exist: boolean }, lower: { val: number, exist: boolean } }, max: Geolocs, min: Geolocs) => {
        let tries = 0;
        let temp = data;
        while ((!calc_var.upper.exist || !calc_var.lower.exist) && tries != 3) {
            calc_var.upper.val = calc_var.mean + (calc_var.n * calc_var.std);
            calc_var.lower.val = calc_var.mean - (calc_var.n * calc_var.std);
            temp = assignColor(data, calc_var);
            if (!calc_var.upper.exist || !calc_var.lower.exist) {
                if (Math.abs(max.agregate[0]?._sum.jumlah_kecelakaan - calc_var.mean) < Math.abs(calc_var.mean - min.agregate[0]?._sum.jumlah_kecelakaan)) {
                    calc_var.n = Math.abs(max.agregate[0]?._sum.jumlah_kecelakaan - calc_var.mean) / calc_var.std;
                } else {
                    calc_var.n = Math.abs(calc_var.mean - min.agregate[0]?._sum.jumlah_kecelakaan) / calc_var.std;
                }
                calc_var.n = (Math.floor(Number(calc_var.n) * 10) / 10 == undefined ? calc_var.n : Math.floor(Number(calc_var.n) * 10) / 10)
            }
            tries += 1;
        }
        setFilters({ ...filters, mean: (Number(calc_var.mean.toFixed(3)) == undefined ? calc_var.mean : Number(calc_var.mean.toFixed(3))), std: (Number(calc_var.std.toFixed(3)) == undefined ? calc_var.std : Number(calc_var.std.toFixed(3))), n: calc_var.n });
        const result = temp;
        return result;
    }

    const geolocsAPI = async () => {
        if (filters.n <= 0) {
            const yearDB = await fetch('/api/geodata/year', {
                method: "GET",
            }).then(async (year_res) => {
                const { data: yearjson }: { data: { tahun: number }[] } = await year_res.json()
                setYearDD(yearjson);
                setFilters({ ...filters, year: yearjson[0].tahun });
                const year_q = filters.year == 0 ? yearjson[0].tahun : filters.year;
                const res = await fetch('/api/geoloc?' + new URLSearchParams({
                    year: year_q.toString(),
                }), {
                    method: "GET",
                }).then(async (geoloc_res) => {
                    const { data }: { data: Geolocs[] } = await geoloc_res.json()
                    if (data.length == 0) {
                        return
                    }

                    // Calculations
                    let calc_var = filters;
                    calc_var.n = 5;
                    calc_var.upper.exist = false;
                    calc_var.lower.exist = false;
                    mean(data, calc_var);
                    std(data, calc_var);
                    const max = data.reduce(function (prev, current) {
                        if (prev.agregate.length == 1 && current.agregate.length == 1) {
                            return (prev && prev.agregate[0]?._sum.jumlah_kecelakaan > current.agregate[0]?._sum.jumlah_kecelakaan) ? prev : current
                        }
                        return current;
                    })
                    const min = data.reduce(function (prev, current) {
                        if (prev.agregate.length == 1 && current.agregate.length == 1) {
                            return (prev && prev.agregate[0]?._sum.jumlah_kecelakaan < current.agregate[0]?._sum.jumlah_kecelakaan) ? prev : current
                        }
                        return current;
                    })
                    const result = calculate(data, calc_var, max, min);
                    setGeolocs(result);
                })
            })

        } else {
            const max = geolocs.reduce(function (prev, current) {
                if (prev.agregate.length == 1 && current.agregate.length == 1) {
                    return (prev && prev.agregate[0]?._sum.jumlah_kecelakaan > current.agregate[0]?._sum.jumlah_kecelakaan) ? prev : current
                }
                return current;
            })
            const min = geolocs.reduce(function (prev, current) {
                if (prev.agregate.length == 1 && current.agregate.length == 1) {
                    return (prev && prev.agregate[0]?._sum.jumlah_kecelakaan < current.agregate[0]?._sum.jumlah_kecelakaan) ? prev : current
                }
                return current;
            })
            const result = calculate(geolocs, filters, max, min);
            setGeolocs(result);
        }
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true)
        geolocsAPI()
    }, [filters.toggle])

    return (
        <div className="relative flex flex-col items-center h-full">
            {loading ? (<Loader />) : (null)}
            <MapContainer
                center={[-7.2752731, 110.1234954]}
                zoom={9}
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
                {geolocs?.map((item: Geolocs) => {
                    const percent = Math.floor(Math.random() * (80 - 20 + 1) + 20)
                    return (<GeoJSON
                        key={JSON.stringify(item)}
                        data={item.geojs}
                        pointToLayer={function (geoJsonPoint, latlng) {
                            return L.marker(latlng, {
                                icon: new L.Icon({
                                    iconUrl: MarkerIcon.src,
                                    iconRetinaUrl: MarkerIcon.src,
                                    iconSize: [25, 41],
                                    iconAnchor: [12.5, 41],
                                    popupAnchor: [0, -41],
                                })
                            });
                        }
                        }
                        onEachFeature={function (feature, layer) {
                            let sumstr = "";
                            item.geodatas?.forEach(elem => sumstr += elem.wilayah + " " + elem.tahun + " " + item.agregate[0]?._sum.jumlah_kecelakaan + "<br />")
                            const popUpContent = (`<Popup>
                                ${sumstr}
                            </Popup>`);
                            layer.bindPopup(popUpContent);
                        }}
                        pathOptions={{
                            fillColor: item.color != undefined ? item.color : "blue",
                            fillOpacity: 0.4,
                            weight: 1,
                            opacity: 1,
                            color: "black"
                        }} />)
                })}
            </MapContainer>
            <div className="fixed bottom-2 z-1200 flex flex-col items-center max-w-1/2 w-fit bg-white shadow-md rounded p-2 text-black">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 content-center">
                    <div className="">
                        <div className="text-left max-w-xl">
                            <p className="text-base md:text-md">
                                <span className="inline-block lg:w-20 sm:w-15 ">Mean</span>
                                <span className="">: {filters.mean}</span><br />
                                <span className="inline-block lg:w-20 sm:w-15 ">Std</span>
                                <span className="">: {filters.std}</span><br />
                                <span className="inline-block lg:w-20 sm:w-15 ">n</span>
                                <span>: </span>
                                <input
                                    type="number"
                                    min={0.1}
                                    placeholder="Enter Longitude"
                                    className="w-1/2 rounded border-stroke bg-transparent font-small outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={filters.n}
                                    step={0.1}
                                    onChange={({ target }) => { setFilters({ ...filters, upper: { ...filters.upper, exist: false }, lower: { ...filters.lower, exist: false }, n: Number(target.value), toggle: !filters.toggle }) }}
                                />
                            </p>
                        </div>
                    </div>
                    <div className="justify-self-end">
                        <Dropdown label="Year" style={{ backgroundColor: "black", color: "white" }} dismissOnClick={false}>
                            {yearDD?.map((item, idx) => {
                                return (
                                    <li key={idx} className="" onClick={() => {
                                        if (filters.year != item.tahun) {
                                            setFilters({ ...filters, n: 0, year: item.tahun, toggle: !filters.toggle })
                                        }
                                    }}>
                                        <button type="button" className={"flex items-center justify-start py-2 px-4 text-sm cursor-pointer w-full dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white" + (filters.year == item.tahun ? " text-white bg-black" : " text-gray-700 bg-white hover:bg-gray-100")} tabIndex={-1}>
                                            {item.tahun}
                                        </button>
                                    </li>
                                )
                            })}
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
