import { GeoData } from "@prisma/client"
import { SortableGeoLocKeys } from "./geoloc"

export type SortableGeoDataKeys = keyof (Omit<GeoData, 'id' | 'geojs' | 'geoloc_id'>& {
    wilayah: string
})
export type SortGeoData = {
    [key in SortableGeoDataKeys]?: 'asc' | 'desc'
}
export interface SortGeoDataWithGeoLocs extends SortGeoData {
    geoloc?: {
        [key in SortableGeoLocKeys]?: 'asc' | 'desc'
    }
}