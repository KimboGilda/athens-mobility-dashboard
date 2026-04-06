import { useRef, useEffect } from 'react';
import L from 'leaflet';
import type { ActiveLayer } from '../types';

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

    L.control.zoom({
      position:'topright'
    }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
    }).addTo(map);

    mapInstance.current = map

  }, [])

  return (
    <div ref={mapRef} className='w-full h-full' />
  )
}

export default Map;
