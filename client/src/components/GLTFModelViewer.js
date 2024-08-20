import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const GLTFModelViewer = ({ modelPath, quaternion }) => {
    const containerRef = useRef(null);
    const modelRef = useRef(null);
    const pivotRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return; // Ensure the container is valid

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1500);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        scene.background = new THREE.Color(0x87CEEB);

        const loader = new GLTFLoader();
        let model, pivot;

        loader.load(modelPath, (gltf) => {
            model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);
            modelRef.current = model;

            pivot = new THREE.Group();
            pivotRef.current = pivot;

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            pivot.position.copy(center);
            pivot.add(model);
            scene.add(pivot);

            // Add axes helper
            const axesHelper = new THREE.AxesHelper(100); 
            pivot.add(axesHelper);

            camera.position.set(center.x-10, center.y + 400 , center.z+ 150);
            camera.lookAt(center);
        }, undefined, (error) => {
            console.error('Model Load error: ', error);
        });

        const lights = [
            new THREE.DirectionalLight(0xffffff, 1),
            new THREE.DirectionalLight(0xffffff, 1),
            new THREE.DirectionalLight(0xffffff, 1),
            new THREE.DirectionalLight(0xffffff, 1),
            new THREE.AmbientLight(0x404040)
        ];
        lights[0].position.set(10, 10, 10).normalize();
        lights[1].position.set(-10, -10, 10).normalize();
        lights[2].position.set(-10, 10, -10).normalize();
        lights[3].position.set(10, -10, -10).normalize();
        lights.forEach(light => scene.add(light));

        let animationFrameId;

        const animate = () => {
            if (!containerRef.current) return;

            animationFrameId = requestAnimationFrame(animate);

            if (pivotRef.current && quaternion) {
                const quat = new THREE.Quaternion(quaternion.qx, quaternion.qy, quaternion.qz, quaternion.qw);
                pivotRef.current.setRotationFromQuaternion(quat);
            }

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);

            if (pivot) {
                scene.remove(pivot);
                pivot.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) object.material.dispose();
                });
            }

            if (renderer) renderer.dispose();

            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [modelPath, quaternion]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {containerRef.current ? null : <p>Loading...</p>}
        </div>
    );
};

export default GLTFModelViewer;
