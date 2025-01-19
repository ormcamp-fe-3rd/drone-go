import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface DroneProp {
  dragPosition: {
    x: number;
    y: number;
  } | null;
}

export default function DroneInMap({dragPosition}:DroneProp) {
  const glb = useLoader(GLTFLoader, "/objects/drone.glb");
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clock = new THREE.Clock();
  const initialRotationRef = useRef<THREE.Euler | null>(null);
  const currentRotationRef = useRef<THREE.Euler | null>(null);

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
  });

  // GLB 크기와 회전 및 머티리얼 속성 설정
  useEffect(() => {
    if (glb.scene) {
      // 크기 설정
      glb.scene.scale.set(100, 100, 100);

      // 회전 설정
      const initialRotation = new THREE.Euler(
        THREE.MathUtils.degToRad(45), // X축 회전
        THREE.MathUtils.degToRad(90), // Y축 회전
        THREE.MathUtils.degToRad(0), // Z축 회전
      );
      glb.scene.rotation.copy(initialRotation);
      initialRotationRef.current = initialRotation.clone();
      currentRotationRef.current = initialRotation.clone();

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
  }, [glb]);

  // dragPosition에 따른 회전 처리
  useFrame(() => {
    if(!glb.scene || !dragPosition) return;
    // 회전 범위
    if(!currentRotationRef.current)return;
    const deltaX = (currentRotationRef.current.x + dragPosition.x * Math.PI * 0.2);
    const deltaY = (currentRotationRef.current.y + dragPosition.y * Math.PI * 0.2);

    //회전
    glb.scene.rotation.x += (deltaX - currentRotationRef.current.x)* 0.5;
    glb.scene.rotation.y += (deltaY - currentRotationRef.current.y) * 0.5;
    
    //회전값 저장
    currentRotationRef.current.x = glb.scene.rotation.x;
    currentRotationRef.current.y = glb.scene.rotation.y;
  });

  return (
    <>
      <ambientLight intensity={3} />
      <directionalLight position={[0, 0, 5]} color="white" />

      {/* GLB 모델 렌더링 */}
      <primitive object={glb.scene} />
    </>
  );
}
