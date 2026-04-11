import { useState } from 'react'
import Map from './components/map'
import StatsBar from './components/stats-bar'
import type { ActiveLayer } from './types'
import 'leaflet/dist/leaflet.css'
import { useBusStops } from './stores/bus-store'

function App() {
  const [activeLayer] = useState<ActiveLayer>('all');
  const [isDarkMap, setIsDarkMap] = useState<boolean>(false);
  const {stops} = useBusStops();

  return (
    <div className="relative w-screen h-screen bg-[#080c14]">

      <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
        <p className={`font-mono font-bold text-[12px] tracking-[0.16em] uppercase mb-1 ${
          isDarkMap ? 'text-[#2dd4a4]' : 'text-[#1f0a8e]'
        }`}>
        Athens
        </p>
        <h1 className={`font-['Syne'] text-[21px] font-bold leading-tight ${
          isDarkMap ? 'text-[#eef0f5]' : 'text-[#080c14]'
        }`}>
          Urban Mobility Dashboard
        </h1>
      </div>

      <Map
        activeLayer={activeLayer}
        onBasemapChange={(isDark) => setIsDarkMap(isDark)}
      />
      <StatsBar
       isDarkMap={false}
       stops={stops.length}/>
    </div>
  )
}

export default App
