export interface transitStop {
  id: string;
  name:string;
  lon:number;
  lat:number;
  transportType:string;
  transitLines:transitLine[];
}

export interface transitStation {
  name: string
  latitude: number
  longitude: number
}

export interface transitLine {
  id:string;
  name:string;
  color:string;
  transportType:string;
  stations: transitStation[];
  routeLine:[number,number][];
}


export type ActiveLayer = 'bus' | 'metro' | 'tram' | 'all';


