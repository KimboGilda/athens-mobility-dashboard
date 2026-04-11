import { useRef, useEffect } from 'react';
import L from 'leaflet';
import type { ActiveLayer } from '../types';
import { metroLines } from '../data/metro-lines';
import { useBusStops } from '../stores/bus-store';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const Map = ({ activeLayer: _activeLayer, onBasemapChange }: {
  activeLayer: ActiveLayer
  onBasemapChange: (isDark: boolean) => void
}) => {

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { stops, loading } = useBusStops();
  const metroLayerGroup = useRef<L.LayerGroup | null>(null);
  const busLayerGroup = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [37.9838, 23.7275],
      zoom: 11,
      zoomControl: false,
      scrollWheelZoom: true,
    })

    L.control.zoom({ position: 'topright' }).addTo(map);

    const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
    })

    const osmMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    })

    osmMap.addTo(map)

    metroLayerGroup.current = L.layerGroup().addTo(map)
    busLayerGroup.current = L.layerGroup().addTo(map)

    const baseMaps = {
      'Dark': darkMap,
      'OpenStreetMap': osmMap,
    }

    const overlays = {
      'Metro Lines': metroLayerGroup.current,
      'Bus Stops': busLayerGroup.current,
    }

    L.control.layers(baseMaps, overlays).addTo(map)

    mapInstance.current = map

    // isDark is true when Dark is selected
    map.on('baselayerchange', (e: L.LayersControlEvent) => {
      onBasemapChange(e.name === 'Dark')
    })
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return

    metroLines.forEach(line => {
      L.polyline(line.routeLine as L.LatLngExpression[], {
        color: line.color,
        weight: 4,
      }).addTo(metroLayerGroup.current!)

      line.stations.forEach(station => {
        L.circleMarker([station.latitude, station.longitude], {
          radius: 5,
          fillColor: line.color,
          color: '#ffffff',
          fillOpacity: 1,
          weight: 1.5,
        })
        .bindPopup(`
          <div style="font-family:monospace;background:#0d1422;color:#c8cdd8;border:1px solid #1e2d44;padding:10px 14px;border-radius:6px">
            <p style="color:${line.color};font-size:11px;letter-spacing:0.1em;margin-bottom:6px">${line.name}</p>
            <p style="font-size:13px;color:#eef0f5">${station.name}</p>
          </div>
        `)
        .addTo(metroLayerGroup.current!)
      })
    })
  }, [])

  useEffect(() => {
    if (!mapInstance.current || loading) return

    const clusterGroup = L.markerClusterGroup()

    stops.forEach(st => {
      L.circleMarker([st.lat, st.lon], {
        radius: 3,
        fillColor: '#9030f0',
        color: '#5a30f0',
        fillOpacity: 0.8,
        weight: 1,
      })
      .bindPopup(`
        <div style="font-family:monospace;background:#0d1422;color:#c8cdd8;border:1px solid #1e2d44;padding:10px 14px;border-radius:6px">
          <p style="font-size:13px;color:#eef0f5">${st.name}</p>
        </div>
      `)
      .addTo(clusterGroup)
    })

    clusterGroup.addTo(busLayerGroup.current!)
  }, [stops, loading])

  return (
    <div ref={mapRef} className='w-full h-full' />
  )
}

export default Map;
