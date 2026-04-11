import { useRef, useEffect } from 'react';
import L, { latLng } from 'leaflet';
import type { ActiveLayer } from '../types';
import { metroLines } from '../data/metro-lines';
import { useBusStops } from '../stores/bus-store';

const Map = ({ activeLayer }: { activeLayer: ActiveLayer }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const {stops, loading, error} = useBusStops();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [37.9838, 23.7275],
      zoom: 11,
      zoomControl: false,
      scrollWheelZoom: true,
    })

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstance.current = map
  }, [])

  // Metro lines
  useEffect(() => {
    if (!mapInstance.current) return

    metroLines.forEach(line => {
      L.polyline(line.routeLine as L.LatLngExpression[], {
        color: line.color,
        weight: 4,
      }).addTo(mapInstance.current!)

      line.stations.forEach(station => {
        L.circleMarker([station.latitude, station.longitude], {
          radius: 5,
          fillColor: line.color,
          color: '#ffffff',
          fillOpacity: 1,
          weight: 1.5,
        })
        .bindPopup(`
          <div class="font-sans bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-lg shadow-md">
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-1" style="color: ${line.color}">
              ${line.name}
            </p>
            <p class="text-sm font-medium text-gray-900">
              ${station.name}
            </p>
          </div>
        `)
        .addTo(mapInstance.current!)
      })
    })
  }, [metroLines]);

  // Bus stops
  useEffect(() => {
    if (!mapInstance.current) return;
     stops.forEach(st => {
      L.circleMarker([st.lat, st.lon], {
        radius: 3,
        fillColor: '#9030f0',
        color: '#5a30f0',
        fillOpacity: 0.8,
        weight: 1,
      })
      .bindPopup(`
          <div class="font-sans bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-lg shadow-md">
            <p class="text-sm font-medium text-gray-900">
              ${st.name}
            </p>
          </div>
        `)
      .addTo(mapInstance.current!)
     })
  }, [stops, loading])

  return (
    <div ref={mapRef} className='w-full h-full' />
  )
}

export default Map;
