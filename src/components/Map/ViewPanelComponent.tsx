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
        mode: string,
        toggle: boolean
    },
    year: {
        selected: number,
        yearDD:
        {
            _id: number
        }[]
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
                            <Label htmlFor="year" value="Select year" />
                        </div>
                        <Select id="year" value={year.selected} onChange={(e) => {
                            selectYear(e);
                        }} required>
                            {year.yearDD?.map((item, idx) => {
                                return (<option key={idx} value={item._id}>{item._id}</option>)
                            })}
                        </Select>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-10 lg:w-20 ">
                            <Label htmlFor="nval" value="n" />
                        </div>
                        <TextInput id="nval" type="number" value={filters.n} min={0.1} onChange={({ target }) => {
                            selectN(target);
                        }} step={0.1} shadow />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full w-10 lg:w-20">
                            <div className="h-full w-1/2 bg-red-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label value={`High Risk (count : ${filters.count.high})`} />
                            <span></span>
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full w-10 lg:w-20">
                            <div className="h-full w-1/2 bg-yellow-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label className="truncate " value={`Moderate Risk (count : ${filters.count.med})`} />
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full w-10 lg:w-20">
                            <div className="h-full w-1/2 bg-green-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label value={`Low Risk (count : ${filters.count.low})`} />
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="h-full w-10 lg:w-20">
                            <div className="h-full w-1/2 bg-blue-200 border-2 border-black">
                            </div>
                        </div>
                        <div className="mx-2">
                            <Label value={`No Data`} />
                        </div>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-10 lg:w-20 ">
                            <Label htmlFor="mean" value="Mean" />
                        </div>
                        <TextInput id="mean" type="number" value={filters.mean} shadow disabled />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="w-10 lg:w-20 ">
                            <Label htmlFor="std" value="Std" />
                        </div>
                        <TextInput id="std" type="number" value={filters.std} shadow disabled />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewPanelComponent;