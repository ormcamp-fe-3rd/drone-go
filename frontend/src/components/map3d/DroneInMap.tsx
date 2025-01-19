import { Canvas, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface DroneProp {
  scale: number;
  rotation: number[];
}

export default function DroneInMap({
  scale,
  rotation,
}: DroneProp) {
  const glb = useLoader(GLTFLoader, "/objects/drone.glb");
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clock = new THREE.Clock();
  
  useEffect(() => {
    // 애니메이션 설정
    if (glb.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(glb.scene);
      glb.animations.forEach((clip) => {
        mixerRef.current?.clipAction(clip).play();
      });
    }

  }, [glb]);

  useEffect(() => {
    let rafId = 0;
    const updateAnimation = () => {
      if (mixerRef.current) {
        const delta = clock.getDelta();
        mixerRef.current.update(delta);
      }
      rafId = requestAnimationFrame(updateAnimation);
    };

    updateAnimation();

    return () => cancelAnimationFrame(rafId);
  }, []);

  // GLB 크기와 회전 및 머티리얼 속성 설정
  useEffect(() => {
    if (glb.scene) {
      // 크기 설정
      glb.scene.scale.set(scale, scale, scale);

      // 회전 설정
      glb.scene.rotation.set(
        THREE.MathUtils.degToRad(rotation[0]), // X축 회전
        THREE.MathUtils.degToRad(rotation[1]), // Y축 회전
        THREE.MathUtils.degToRad(rotation[2]), // Z축 회전
      );

      // 메탈 재질과 거칠기 설정
      glb.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.metalness = 0.4; // 메탈릭 효과 (0 ~ 1)
                material.roughness = 0.3; // 거칠기 효과 (0 ~ 1)
                material.needsUpdate = true; // 변경 사항 적용
              }
            });
          } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.metalness = 0.4; // 메탈릭 효과
            mesh.material.roughness = 0.3; // 거칠기 효과
            mesh.material.needsUpdate = true; // 변경 사항 적용
          }
        }
      });
    }
  }, [glb, scale, rotation]);

  return (
      <Canvas camera={{ position: [0, 50, 100], fov: 75 }}>
        <ambientLight intensity={3} />
        <directionalLight position={[0, 0, 5]} color="white" />

        {/* GLB 모델 렌더링 */}
        <primitive object={glb.scene} />
      </Canvas>
  );
}
