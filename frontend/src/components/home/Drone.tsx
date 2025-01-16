import { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

interface DroneProp {
  scale: number;
  rotation: number[];
  yAnimationHeight: number; // Y축 애니메이션의 최대 높이
}

export default function Drone({
  scale,
  rotation,
  yAnimationHeight, // 기본 높이 5
}: DroneProp) {
  const glb = useLoader(GLTFLoader, "../../public/objects/drone.glb");
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

    // Y축 애니메이션을 위한 추가 설정
    if (yAnimationHeight) {
      // 키프레임 트랙 설정: Y축 위치 변경 (0 -> 높이 -> 높이 -> 0)
      const yAnimation = new THREE.AnimationClip("YAnimation", -1, [
        new THREE.KeyframeTrack(
          ".position[y]", // Y축 애니메이션
          [0, 1, 2, 3], // 애니메이션 시간 (초)
          [0, yAnimationHeight, yAnimationHeight, 0], // Y축 위치 (0 -> 높이 -> 높이 -> 0)
        ),
      ]);

      // Easing을 적용하여 부드러운 움직임 만들기
      yAnimation.tracks[0].setInterpolation(THREE.InterpolateSmooth); // 부드럽게 시작하고 끝나도록 설정

      // 애니메이션 믹서에 Y축 애니메이션 추가
      if (mixerRef.current) {
        mixerRef.current.clipAction(yAnimation).play();
      }
    }
  }, [glb, yAnimationHeight]);

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
    <div
      className="absolute z-30"
      style={{ width: "80vw", height: "80vh", top: "10%", right: "10%" }}
    >
      <Canvas camera={{ position: [0, 50, 100], fov: 75 }}>
        <ambientLight intensity={3} />
        <directionalLight position={[0, 0, 5]} color="white" />

        {/* GLB 모델 렌더링 */}
        <primitive object={glb.scene} />
      </Canvas>
    </div>
  );
}
