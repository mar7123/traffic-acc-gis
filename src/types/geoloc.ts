import { GeoLocation } from "@prisma/client";

export type SortableGeoLocKeys = keyof Omit<GeoLocation, 'id' | 'geojs'>
export type SortGeoLoc = {
    [key in SortableGeoLocKeys]?: 'asc' | 'desc'
}