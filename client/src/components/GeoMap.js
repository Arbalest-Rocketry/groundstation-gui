import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl';

import ControlPanel from './Cards/control-panel';

const TOKEN = 'pk.eyJ1IjoiYWNyZmFjdG9yeSIsImEiOiJjbHg4eGVkb3YyZnlxMmpvYWV6ZDNuY2MyIn0.leZ1_Go8xIbTMXC8MmDBBw'; // Set your mapbox token here

const skyLayer = {
  id: 'sky',
  type: 'sky',
  paint: {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15
  }
};

export default function GeoMap() {
  return (
    <>
        <div style={{ height: '1000px', width : '100%',position: 'relative', marginTop: '20px' }}>
      <Map
        initialViewState={{
          latitude: 43.772408, 
          longitude: -79.498285,
          zoom: 14,
          bearing: 80,
          pitch: 80
        }}
        maxPitch={85}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={TOKEN}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        <Layer {...skyLayer} />
      </Map>
      <ControlPanel />
      </div>
    </>
  );
}
