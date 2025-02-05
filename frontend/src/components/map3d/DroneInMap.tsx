import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function DroneInMap() {
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
  });
  
  // GLB 크기와 회전 및 머티리얼 속성 설정
  useEffect(() => {
    if (glb.scene) {
      // 크기 설정
      glb.scene.scale.set(100, 100, 100);
      
      glb.scene.rotation.set(THREE.MathUtils.degToRad(80), THREE.MathUtils.degToRad(90), 0);
      
      
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
  
  // TODO: dragPosition에 따른 회전 처리
  // const [rotationX, setRotationX] = useState(0);
  // const [rotationY, setRotationY] = useState(0);

  // useFrame(() => {
  //   if(!glb.scene || !dragPosition) return;

  //   //현재 회전값 저장
  //   setRotationX(glb.scene.rotation.x);
  //   setRotationY(glb.scene.rotation.y);

  //   //회전 범위
  //   const deltaX = rotationX + dragPosition.x * Math.PI * 0.2;
  //   const deltaY = rotationY + dragPosition.y * Math.PI * 0.2;

  //   //회전
  //   glb.scene.rotation.x += (deltaX - rotationX) * 0.5;
  //   glb.scene.rotation.y += (deltaY - rotationY) * 0.5;

  // });

  return (
    <>
      <ambientLight intensity={3} />
      <directionalLight position={[0, 0, 5]} color="white" />

      {/* GLB 모델 렌더링 */}
      <primitive object={glb.scene} />
    </>
  );
}
