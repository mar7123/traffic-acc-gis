'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function EditForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [formData, setFormData] = useState({
        tahun: "",
        prov: "",
        kw_hutan: "",
        kw_bukan_hutan: "",
        total: "",
    });
    const [loading, setLoading] = useState<boolean>(true);

    const geodataAPI = async () => {
        const param = searchParams.get('id')
        const res = await fetch('/api/geodata/id?' + new URLSearchParams({
            id: param ? param : "",
        }), {
            method: "GET",
            cache: "no-store"
        })
        const { data } = await res.json();
        if (res.status == 200) {
            setFormData({
                tahun: data.tahun,
                prov: data.provinsi,
                kw_hutan: data.kawasan_hutan,
                kw_bukan_hutan: data.bukan_kawasan_hutan,
                total: data.total_deforestasi,
            });
        }
    }
    const editGeoData = async () => {
        const param = searchParams.get('id')
        if (param == null) {
            return;
        }
        const res = await fetch('/api/geodata/update', {
            method: "POST",
            body: JSON.stringify({
                id: param ? param : "",
                data: {
                    tahun: Number(formData.tahun),
                    provinsi: formData.prov,
                    kawasan_hutan: Number(formData.kw_hutan),
                    bukan_kawasan_hutan: Number(formData.kw_bukan_hutan),
                    total_deforestasi: Number(formData.total),
                }
            })
        })
        const { message } = await res.json()
        if (res.status == 201) {
            router.push("/tables");
        } else {
        }
    }

    useEffect(() => {
        setLoading(true)
        geodataAPI()
        setTimeout(() => setLoading(false), 500);
    }, [])

    return (
        <div className="grid  w-full gap-9 ">
            <div className="flex flex-col w-full gap-9">
                {/* <!-- Form --> */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Edit Data
                        </h3>
                    </div>
                    <form onSubmit={(event: any) => {
                        event.preventDefault();
                        editGeoData();
                    }}>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Tahun <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Year"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.tahun}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, tahun: target.value })
                                    }
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Provinsi
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Provinsi"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.prov}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, prov: target.value })
                                    }
                                    disabled
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Kawasan Hutan <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Kawasan Hutan"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.kw_hutan}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, kw_hutan: target.value })
                                    }
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Bukan Kawasan Hutan <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Bukan Kawasan Hutan"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.kw_bukan_hutan}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, kw_bukan_hutan: target.value })
                                    }
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Total Deforestasi <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Total Deforestasi"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.total}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, total: target.value })
                                    }
                                />
                            </div>
                            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}