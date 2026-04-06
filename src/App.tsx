import { useState } from 'react'
import Map from './components/map'
import type { ActiveLayer } from './types'
import 'leaflet/dist/leaflet.css'

function App() {
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('all')

  return (
    <div className="w-screen h-screen bg-[#080c14]">
      <Map activeLayer={activeLayer} />
    </div>
  )
}

export default App
