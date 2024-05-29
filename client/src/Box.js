import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';

const Box = ({ quaternionData, ...props }) => {
  // This reference will give us direct access to the mesh
  const meshRef = useRef();

  // Subscribe this component to the render-loop, update the mesh rotation based on the quaternion data
  useFrame(() => {
    if (quaternionData) {
      const { q_r, q_i, q_j, q_k } = quaternionData;
      const quaternion = new THREE.Quaternion(q_i, q_j, q_k, q_r);
      quaternion.normalize(); //set the size consistent
      meshRef.current.quaternion.copy(quaternion);
    }
  });

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
    >
      <boxGeometry args={[3, 3, 1.5]} />
      <meshStandardMaterial color={'lightblue'} />
      <Edges
        scale={1}
        color="black"
      />
    </mesh>
  );
};

export default Box;
