import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const Rocket = ({ quaternionData, ...props }) => {
  const meshRef = useRef();
  const gltf = useLoader(GLTFLoader, '/rocket.gltf');

  useEffect(() => {
    if (gltf && gltf.scene) {
      // Calculate the bounding box
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Center the model and then raise it
      gltf.scene.position.sub(center);
      gltf.scene.position.y += size.y / 2; // Adjust this value to raise the center further if needed
    }
  }, [gltf]);

  useFrame(() => {
    if (quaternionData && meshRef.current) {
      const { qi, qj, qk, qr } = quaternionData;
      const quaternion = new THREE.Quaternion(qi, qj, qk, qr);
      quaternion.normalize(); // Normalize the quaternion
      meshRef.current.quaternion.copy(quaternion);
    }
  });

  return <primitive object={gltf.scene} ref={meshRef} {...props} />;
};

const Scene = ({ quaternionData }) => {
  const { camera } = useThree();

  useEffect(() => {
    // Position the camera to the side of the rocket
    camera.position.set(10, 0, 0); // Adjust these values as needed for side view
    camera.lookAt(0, 0, 0); // Look at the center of the scene where the rocket is positioned

    // Optionally, rotate the camera around the Y-axis for a better side view
    camera.rotation.y = Math.PI / 2; // Rotate 90 degrees around the Y-axis
  }, [camera]);

  return (
    <Rocket quaternionData={quaternionData} />
  );
};

export default Scene;
