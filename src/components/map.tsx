import { useRef, useEffect } from 'react';
import L from 'leaflet';
import type { ActiveLayer } from '../types';
import { metroLines } from '../data/metro-lines';

const Map = ({ activeLayer }: { activeLayer: ActiveLayer }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

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
  }, [metroLines])

  return (
    <div ref={mapRef} className='w-full h-full' />
  )
}

export default Map;
