import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const modelRef = useRef(null); // Nueva referencia para el modelo
  const [model, setModel] = useState(null);
  const targetRotationY = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(-70, 18, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 23, 225);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('/porsche.glb', (gltf) => {
      const loadedModel = gltf.scene;
      
      loadedModel.scale.set(30.5, 24.7, 30.5);
      loadedModel.rotation.y = -Math.PI / 2.8;
      scene.add(loadedModel);

      setModel(loadedModel); // Para animación
      modelRef.current = loadedModel; // Para animación
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

  // useEffect(() => {
  //   if (model) {
  //     model.traverse((child) => {
  //       if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
  //         child.material.color.set(color);
  //       }
  //     });
  //   }
  // }, [color, model]);

  const step02 = () => {
    if (modelRef.current) {
      targetRotationY.current = -Math.PI / 1.8; // Cambia el ángulo deseado aquí
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {/* <div style={{ display: 'flex', gap: '20px', position: 'absolute', top: '40px', left: '47vw' }}>
        <button style={{ width: '40px', height: '40px', background: '#ff0000', border: 'none', cursor: 'pointer' }} onClick={() => handleColorChange('#ff0000')}></button>
        <button style={{ width: '40px', height: '40px', background: '#00ff00', border: 'none', cursor: 'pointer' }} onClick={() => handleColorChange('#00ff00')}></button>
        <button style={{ width: '40px', height: '40px', background: '#0000ff', border: 'none', cursor: 'pointer' }} onClick={() => handleColorChange('#0000ff')}></button>
      </div> */}
      <div style={{ display: 'flex', gap: '20px', position: 'absolute', bottom: '120px', left: '50vw' }}>
        <button style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }} onClick={step02}>next</button>
      </div>
    </div>
  );
}