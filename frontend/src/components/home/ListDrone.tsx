import { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

interface ListDroneProp {
  scale: number;
  rotation: number[];
  yAnimationHeight: number; // Y축 애니메이션의 최대 높이
}

export default function ListDrone({
  scale,
  rotation,
  yAnimationHeight,
}: ListDroneProp) {
  const glb = useLoader(GLTFLoader, "/objects/drone.glb");
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clock = new THREE.Clock();

  useEffect(() => {
    if (glb.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(glb.scene);
      glb.animations.forEach((clip) => {
        mixerRef.current?.clipAction(clip).play();
      });
    }

    if (yAnimationHeight) {
      const yAnimation = new THREE.AnimationClip("YAnimation", -1, [
        new THREE.KeyframeTrack(
          ".position[y]",
          [0, 1, 2, 3],
          [0, yAnimationHeight, yAnimationHeight, 0],
        ),
      ]);

      yAnimation.tracks[0].setInterpolation(THREE.InterpolateSmooth); // 부드럽게 시작하고 끝나도록 설정

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

  useEffect(() => {
    if (glb.scene) {
      glb.scene.scale.set(scale, scale, scale);

      glb.scene.rotation.set(
        THREE.MathUtils.degToRad(rotation[0]), // X축 회전
        THREE.MathUtils.degToRad(rotation[1]), // Y축 회전
        THREE.MathUtils.degToRad(rotation[2]), // Z축 회전
      );

      glb.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.metalness = 0.4;
                material.roughness = 0.3;
                material.needsUpdate = true;
              }
            });
          } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.metalness = 0.4;
            mesh.material.roughness = 0.3;
            mesh.material.needsUpdate = true;
          }
        }
      });
    }
  }, [glb, scale, rotation]);

  return (
    <div className="absolute right-0 top-56 z-30 h-[80vh] w-[70vw]">
      <Canvas camera={{ position: [0, 50, 100], fov: 75 }}>
        <ambientLight intensity={3} />
        <directionalLight position={[0, 0, 5]} color="white" />

        <primitive object={glb.scene} />
      </Canvas>
    </div>
  );
}
