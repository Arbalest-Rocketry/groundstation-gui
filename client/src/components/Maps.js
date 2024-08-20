import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWNyZmFjdG9yeSIsImEiOiJjbHg4eGVkb3YyZnlxMmpvYWV6ZDNuY2MyIn0.leZ1_Go8xIbTMXC8MmDBBw';

const MapComponent = ({ isActive, latestData, trajData }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const [mapPosition, setMapPosition] = useState({
        latitude: 43.771870,
        longitude: -79.506625
    });
    
    const [gpsPoints, setGpsPoints] = useState([]);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/acrfactory/clzx8zbln008101qr0p28bjxz',
            zoom: 18,
            center: [mapPosition.longitude, mapPosition.latitude],
            pitch: 0
        });

        mapRef.current = map;

        map.on('load', () => {
            map.addSource('trajectory', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            map.addLayer({
                id: 'trajectory-line',
                type: 'line',
                source: 'trajectory',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#ff7f00',
                    'line-width': 4
                }
            });

            map.addLayer({
                id: 'trajectory-points',
                type: 'circle',
                source: 'trajectory',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#007cbf'
                }
            });
        });

        return () => {
            map.remove();
        };
    }, [mapPosition]);

    useEffect(() => {
        if (!isActive) return;

        const handleResize = () => {
            mapRef.current.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive]);

    useEffect(() => {
        if (mapRef.current && latestData) {
            const { longitude, latitude } = latestData;

            if (longitude && latitude) {
                mapRef.current.setCenter([longitude, latitude]);
            }
        }
    }, [latestData]);

    useEffect(() => {
        if (mapRef.current && trajData && trajData.length > 0) {
            const newGpsPoints = trajData.map(({ longitude, latitude, timestamp }) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                properties: {
                    timestamp,
                    latitude,
                    longitude
                }
            }));

            const lineCoordinates = trajData.map(({ longitude, latitude }) => [longitude, latitude]);

            setGpsPoints(newGpsPoints);

            mapRef.current.getSource('trajectory').setData({
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: lineCoordinates
                        },
                        properties: {}
                    },
                    ...newGpsPoints
                ]
            });

            // Add popups for each point
            newGpsPoints.forEach((point) => {
                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setText(`Time: ${point.properties.timestamp}\nLat: ${point.properties.latitude}\nLng: ${point.properties.longitude}`);

                new mapboxgl.Marker()
                    .setLngLat(point.geometry.coordinates)
                    .setPopup(popup)
                    .addTo(mapRef.current);
            });
        }
    }, [trajData]);

    return (
        <div ref={mapContainerRef} style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '100%' }}>
        </div>
    );
};

export default MapComponent;
