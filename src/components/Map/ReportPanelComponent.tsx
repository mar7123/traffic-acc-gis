import { Label, Select, TextInput } from "flowbite-react";
import { ChangeEvent } from "react";

const ReportPanelComponent = ({
    year,
    selectYear,
}: {
    year: {
        selected: number,
        yearDD:
        {
            tahun: number
        }[]
    },
    selectYear: (e: ChangeEvent<HTMLSelectElement>) => void,
}) => {
    return (
        <>
            <div className="bg-gray-900 py-2 px-4">
                <span className="text-white text-md">
                    Accident Report Panel
                </span>
            </div>
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
                                return (<option key={idx} value={item.tahun}>{item.tahun}</option>)
                            })}
                        </Select>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportPanelComponent;