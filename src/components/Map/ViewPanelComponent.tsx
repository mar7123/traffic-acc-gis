import { Label, Select, TextInput } from "flowbite-react";
import { ChangeEvent } from "react";

const ViewPanelComponent = ({
    filters,
    year,
    selectYear,
    selectN
}: {
    filters: {
        count: {
            data: number,
            high: number,
            med: number,
            low: number,
        },
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
    },
    year: {
        selected: number,
        yearDD: number[]
    },
    selectYear: (e: ChangeEvent<HTMLSelectElement>) => void,
    selectN: (target: EventTarget & HTMLInputElement) => void
}) => {
    return (
        <>
            <div className="overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 py-2 px-4">
                    <div className="w-full">
                        <div className="mb-2">
                            <Label htmlFor="year" value="Pilih tahun" />
                        </div>
                        <Select id="year" value={year.selected} onChange={(e) => {
                            selectYear(e);
                        }} required>
                            {year.yearDD?.map((item, idx) => {
                                return (<option key={idx} value={item}>{item}</option>)
                            })}
                        </Select>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-30 lg:w-35 ">
                            <Label htmlFor="nval" value="n" />
                        </div>
                        <TextInput className="w-1/2 bg-white" id="nval" type="number" value={filters.n == 5 ? 0 : filters.n} min={0.1} onChange={({ target }) => {
                            selectN(target);
                        }} step={0.1} shadow disabled={filters.n == 5 ? true : false} />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-30 lg:w-35">
                            <Label className="w-full block truncate" htmlFor="upper_bound" value="Batas Atas" />
                        </div>
                        <TextInput className="w-1/2 bg-white" id="upper_bound" type="number" value={filters.upper.val} shadow disabled />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-30 lg:w-35">
                            <Label className="w-full block truncate" htmlFor="lower_bound" value="Batas Bawah" />
                        </div>
                        <TextInput className="w-1/2 bg-white" id="lower_bound" type="number" value={filters.lower.val} shadow disabled />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full flex items-center w-5 lg:w-10">
                            <div className="w-[15px] h-[15px] rounded-full bg-red-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label className="w-full block truncate" value={`Risiko Tinggi (jumlah : ${filters.count.high})`} />
                            <span></span>
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full flex items-center w-5 lg:w-10">
                            <div className="w-[15px] h-[15px] rounded-full bg-yellow-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label className="w-full block truncate" value={`Risiko Sedang (jumlah : ${filters.count.med})`} />
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full flex items-center w-5 lg:w-10">
                            <div className="w-[15px] h-[15px] rounded-full bg-green-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label className="w-full block truncate" value={`Risiko Rendah (jumlah : ${filters.count.low})`} />
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full flex items-center w-5 lg:w-10">
                            <div className="w-[15px] h-[15px] rounded-full bg-blue-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label className="w-full block truncate" value={`Tidak ada data`} />
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-30 lg:w-35 ">
                            <Label className="w-full block truncate" htmlFor="mean" value="Rata-rata" />
                        </div>
                        <TextInput className="w-1/2 bg-white" id="mean" type="number" value={filters.mean} shadow disabled />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-30 lg:w-35">
                            <Label className="w-full block truncate" htmlFor="std" value="Deviasi Standar" />
                        </div>
                        <TextInput className="w-1/2 bg-white" id="std" type="number" value={filters.std} shadow disabled />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewPanelComponent;