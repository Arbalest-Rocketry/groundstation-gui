import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWNyZmFjdG9yeSIsImEiOiJjbHg4eGVkb3YyZnlxMmpvYWV6ZDNuY2MyIn0.leZ1_Go8xIbTMXC8MmDBBw';

const GeoMap = ({ latestData }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const model = useRef(null);

  useEffect(() => {
    // Default initial coordinates
    let initialLatitude = 43.771865;
    let initialLongitude = -79.506482;
    let initialAltitude = 0;

    // Use coordinates from latestData if available
    if (latestData && !isNaN(latestData.latitude) && !isNaN(latestData.longitude) && !isNaN(latestData.altitude)) {
      initialLatitude = latestData.latitude;
      initialLongitude = latestData.longitude;
      initialAltitude = latestData.altitude;
    }

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 18,
      center: [initialLongitude, initialLatitude],
      pitch: 60,
      antialias: true,
    });

    const initialModelOrigin = [initialLongitude, initialLatitude];
    const modelRotate = [Math.PI / 2, 0, 0];

    let modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      initialModelOrigin,
      initialAltitude
    );

    let modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
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
        loader.load('/rocket.gltf', (gltf) => {
          this.scene.add(gltf.scene);
          model.current = gltf.scene; // Save reference to the model
        });

        this.map = map;

        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
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
      },
    };

    map.current.on('style.load', () => {
      map.current.addLayer(customLayer, 'waterway-label');
    });

    return () => {
      map.current.remove();
    };
  }, [latestData]);

  useEffect(() => {
    if (latestData) {
      const { latitude, longitude, altitude, qr, qi, qj, qk } = latestData;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      if (!isNaN(longitude) && !isNaN(latitude) && !isNaN(altitude)) {
        const newMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
          [longitude, latitude],  // Longitude and Latitude
          altitude
        );

        if (map.current) {
          map.current.setCenter([longitude, latitude]);
        }

        if (model.current) {
          // Update model position
          model.current.position.set(
            newMercatorCoordinate.x,
            newMercatorCoordinate.y,
            newMercatorCoordinate.z
          );

          // Update model rotation
          const quaternion = new THREE.Quaternion(qi, qj, qk, qr).normalize();
          model.current.setRotationFromQuaternion(quaternion);
        }
      } else {
        console.error('Invalid data received:', latestData);
      }
    }
  }, [latestData]);

  return <div ref={mapContainer} style={{ position: 'relative', top: 0, bottom: 0, width: '100%' }} />;
};

export default GeoMap;
