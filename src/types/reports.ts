import { Reports } from "@prisma/client"
import { SortableGeoLocKeys } from "./geoloc"

export type SortableReportKeys = keyof (Omit<Reports, 'id' | 'geojs' | 'geoloc_id' | 'processed'> & {
    wilayah: string
})
export type SortReport = {
    [key in SortableReportKeys]?: 'asc' | 'desc'
}
export interface SortReportWithGeoLocs extends SortReport {
    geoloc?: {
        [key in SortableGeoLocKeys]?: 'asc' | 'desc'
    }
}