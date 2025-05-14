import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const targetRotationY = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      10,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-10, 4, 18); // izquierda, arriba, atrás
    camera.lookAt(0, 0, 0);        // mira al centro de la escena

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // 1. Luz principal (simula un softbox grande al frente)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(15, 15, -5);
    scene.add(keyLight);

    // 2. Luz de relleno (suaviza las sombras)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 2, 5);
    scene.add(fillLight);

    // 3. Luz de contra (da brillo al borde del objeto)
    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 5, -5);
    scene.add(backLight);

    // 4. Luz ambiental suave para completar
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // const helper1 = new THREE.DirectionalLightHelper(keyLight, 1);
    // scene.add(helper1);

    // const helper2 = new THREE.DirectionalLightHelper(fillLight, 1);
    // scene.add(helper2);

    // const helper3 = new THREE.DirectionalLightHelper(backLight, 1);
    // scene.add(helper3);

    const loader = new GLTFLoader();
    loader.load('/mclaren.glb', (gltf) => {
      const loadedModel = gltf.scene;

        loadedModel.position.y = -0.5; // 🔼 Subir 5 unidades en el eje Y

      // Sin cambios de escala, rotación ni posición
      scene.add(loadedModel);
      modelRef.current = loadedModel;
      targetRotationY.current = loadedModel.rotation.y;
    });

    const animate = () => {
      requestAnimationFrame(animate);

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

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.innerHTML = '';
    };
  }, []);

  const step02 = () => {
    if (modelRef.current) {
      targetRotationY.current = -Math.PI / 1.8;
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}