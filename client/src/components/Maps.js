import React from 'react';
import { Map } from 'react-map-gl';
import {OrthographicView} from '@deck.gl/core';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import { Canvas } from 'react-three-map/maplibre'

import '../css/Map.css';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYWNyZmFjdG9yeSIsImEiOiJjbHg4eGVkb3YyZnlxMmpvYWV6ZDNuY2MyIn0.leZ1_Go8xIbTMXC8MmDBBw";
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  latitude: 43.772725,
  longitude: -79.498628,
  zoom: 12,
  bearing: 0,
  pitch: 30
};

const data = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-79.5030785, 43.7733]
      },
      properties: {
        name: "Point 1"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-79.5030785, 43.774]
      },
      properties: {
        name: "Point 2"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-79.5030, 43.775]
      },
      properties: {
        name: "Point 3"
      }
    }
  ]
};

const layers = [
  new GeoJsonLayer({
    id: 'geojson-layer',
    data,
    pickable: true,
    stroked: false,
    filled: true,
    pointRadiusMinPixels: 5,
    getPointRadius: 100,
    getFillColor: [255, 140, 0, 200],
    onClick: ({ object }) => alert(object.properties.name)
  })
];

function Maps() {
  return (
    <div style={{ height: '1000px', width : '100%',position: 'relative', marginTop: '20px' }}>

        <Map
          mapStyle={MAP_STYLE}
          style = {{}}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          >
              <Canvas latitude={43.772725} longitude={-79.498628}>
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      </Canvas>

          </Map>
          </div>
  );
}

export default Maps;
