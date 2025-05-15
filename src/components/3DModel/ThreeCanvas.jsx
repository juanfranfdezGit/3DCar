import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const targetRotationY = useRef(null);
  const cameraAnimStartedRef = useRef(false);
  const cameraClockRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      10,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );

    const initialCamPos = new THREE.Vector3(-7, 2, 10);
    const targetCamPos = new THREE.Vector3(-10, 4, 18);

    camera.position.copy(initialCamPos); 
    camera.lookAt(0, 0, 0);  

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(15, 15, -5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 2, 5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 5, -5);
    scene.add(backLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const duration = 2.0;

    // Activar animación de cámara tras 1 segundo
    setTimeout(() => {
      cameraAnimStartedRef.current = true;
      cameraClockRef.current = new THREE.Clock();
    }, 1500);

    const loader = new GLTFLoader();
    loader.load('/mclaren.glb', (gltf) => {
      const loadedModel = gltf.scene;
      loadedModel.position.y = -0.5;
      scene.add(loadedModel);
      modelRef.current = loadedModel;
      targetRotationY.current = loadedModel.rotation.y;
    });

    const animate = () => {
      requestAnimationFrame(animate);

      // Solo animar cámara si ha comenzado
      if (cameraAnimStartedRef.current) {
        const elapsedTime = cameraClockRef.current.getElapsedTime();
        if (elapsedTime < duration) {
          const t = elapsedTime / duration;
          camera.position.lerpVectors(initialCamPos, targetCamPos, t);
        } else {
          camera.position.copy(targetCamPos);
        }

        camera.lookAt(0, 0, 0);
      }

      // Rotación del modelo
      if (modelRef.current && targetRotationY.current !== null) {
        modelRef.current.rotation.y = THREE.MathUtils.lerp(
          modelRef.current.rotation.y,
          targetRotationY.current,
          0.02
        );
      }

      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}