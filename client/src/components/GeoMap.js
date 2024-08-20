import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWNyZmFjdG9yeSIsImEiOiJjbHg4eGVkb3YyZnlxMmpvYWV6ZDNuY2MyIn0.leZ1_Go8xIbTMXC8MmDBBw';

const MapComponent = ({ isActive, quaternionData, latestData }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const modelRef = useRef(null);

    const [modelPosition, setModelPosition] = useState({
        //         43.771870, -79.506625
        latitude: 43.771870,
        longitude: -79.506625,
        altitude: 0
    });

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.resize();
        }
    }, [isActive]);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWNyZmFjdG9yeSIsImEiOiJjbHg4eGVkb3YyZnlxMmpvYWV6ZDNuY2MyIn0.leZ1_Go8xIbTMXC8MmDBBw';
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/acrfactory/clzx8zbln008101qr0p28bjxz',
            zoom: 18,
            center: [modelPosition.longitude, modelPosition.latitude],
            pitch: 60,
            antialias: true
        });

        mapRef.current = map;

        const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
            [modelPosition.longitude, modelPosition.latitude],
            modelPosition.altitude
        );

        const modelScale = 3; // Increase this value to scale up the model

        const modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: Math.PI / 2,
            rotateY: 0,
            rotateZ: 0,
            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * modelScale
        };

        const customLayer = {
            id: '3d-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, gl) {
                this.camera = new THREE.Camera();
                this.scene = new THREE.Scene();

                const directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(0, -70, 100).normalize();
                this.scene.add(directionalLight);

                const directionalLight2 = new THREE.DirectionalLight(0xffffff);
                directionalLight2.position.set(0, 70, 100).normalize();
                this.scene.add(directionalLight2);

                const loader = new GLTFLoader();
                loader.load(
                    '/rocket.gltf', // Ensure this path is correct and the file is in the public folder
                    (gltf) => {
                        gltf.scene.scale.set(modelScale, modelScale, modelScale); // Scale the model
                        modelRef.current = gltf.scene;
                        this.scene.add(gltf.scene);
                    }
                );
                this.map = map;

                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });

                this.renderer.autoClear = false;
            },
            render: function (gl, matrix) {
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    modelTransform.rotateX
                );
                const rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    modelTransform.rotateY
                );
                const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    modelTransform.rotateZ
                );

                const m = new THREE.Matrix4().fromArray(matrix);
                const l = new THREE.Matrix4()
                    .makeTranslation(
                        modelTransform.translateX,
                        modelTransform.translateY,
                        modelTransform.translateZ
                    )
                    .scale(
                        new THREE.Vector3(
                            modelTransform.scale,
                            -modelTransform.scale,
                            modelTransform.scale
                        )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);

                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.resetState();
                this.renderer.render(this.scene, this.camera);
                this.map.triggerRepaint();
            }
        };

        map.on('style.load', () => {
            map.addLayer(customLayer, 'waterway-label');
        });

        const handleResize = () => {
            map.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            map.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, [modelPosition]);

    useEffect(() => {
        if (modelRef.current && quaternionData) {
            const { qi, qj, qk, qr } = quaternionData;
            const quaternion = new THREE.Quaternion(qi, qj, qk, qr).normalize();
            modelRef.current.setRotationFromQuaternion(quaternion);
        }
    }, [quaternionData]);

    useEffect(() => {
        if (latestData) {
            setModelPosition({
                longitude: latestData.longitude || modelPosition.longitude,
                latitude: latestData.latitude || modelPosition.latitude,
                altitude: latestData.altitude || modelPosition.altitude
            });
        }
    }, [latestData]);

    return (
        <div ref={mapContainerRef} style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '100%' }}></div>
    );
};

export default MapComponent;