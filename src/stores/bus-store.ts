import { useState, useEffect } from 'react'
import type { transitStop } from '../types'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const query = `
  [out:json];
  node["highway"="bus_stop"](37.8,23.5,38.2,24.1);
  out;
`

let cachedStops: transitStop[] | null = null

export const useBusStops = () => {
  const [stops, setStops] = useState<transitStop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    if (cachedStops) return;

    const fetchStops = async () => {
      try {
        const res = await fetch(OVERPASS_URL, {
          method: 'POST',
          body: `data=${query}`,
        })

        const data = await res.json()

        const parsed: transitStop[] = data.elements.map((el: any) => ({
          id:            String(el.id),
          name:          el.tags?.name ?? 'Unknown',
          lat:           el.lat,
          lon:           el.lon,
          transportType: 'bus',
          transitLines:  [],
        }))

        cachedStops = parsed;
        setStops(parsed)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStops()
  }, [])

  return { stops, loading, error }
}
