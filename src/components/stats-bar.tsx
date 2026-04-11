import { metroLines } from "../data/metro-lines"

const StatsBar = ({ stops, isDarkMap }: {
  isDarkMap: boolean
  stops:number
}) => {

  const metroLinesStat = metroLines.length
  const totalStations = metroLines.reduce((sum, line) => sum + line.stations.length, 0)


  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-4">

      <div className="bg-[#0d1422]/90 border border-[#1e2d44] rounded-lg px-4 py-3 min-w-[120px]">
        <p className="font-mono text-[9px] tracking-widest uppercase text-[#3a4a60] mb-1">Metro Lines</p>
        <p className="font-mono text-[13px] font-bold text-[#2dd4a4]">{metroLinesStat}</p>
      </div>

      <div className="bg-[#0d1422]/90 border border-[#1e2d44] rounded-lg px-4 py-3 min-w-[120px]">
        <p className="font-mono text-[9px] tracking-widest uppercase text-[#3a4a60] mb-1">Metro Stations</p>
        <p className="font-mono text-[13px] font-bold text-[#2dd4a4]">{totalStations}</p>
      </div>

      <div className="bg-[#0d1422]/90 border border-[#1e2d44] rounded-lg px-4 py-3 min-w-[120px]">
        <p className="font-mono text-[9px] tracking-widest uppercase text-[#3a4a60] mb-1">Bus Stops</p>
        <p className="font-mono text-[13px] font-bold text-[#f0a030]">{stops.toLocaleString()}</p>
      </div>

    </div>
  )
}

export default StatsBar
