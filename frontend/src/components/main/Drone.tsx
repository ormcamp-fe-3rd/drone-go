import { useRef, useEffect } from "react"; // React에서 useRef와 useEffect를 임포트
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function Drone() {
  const glb = useLoader(GLTFLoader, "../../public/objects/drone.glb"); // GLB 파일 로드
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

    // 본체와 날개의 위치 설정
    glb.scene.position.set(0, 0, 0);
    glb.scene.rotation.set(0, Math.PI / 2, 0);

    // 날개 객체를 가져와서 회전 축을 수정
    const wing1 = glb.scene.getObjectByName("wing1"); // 날개1 객체 이름 (GLB 모델의 객체 이름 확인 필요)
    const wing2 = glb.scene.getObjectByName("wing2"); // 날개2 객체 이름 (GLB 모델의 객체 이름 확인 필요)
    if (wing1 && wing2) {
      // 날개가 본체와 독립적으로 회전하도록 설정
      wing1.rotation.set(Math.PI / 2, 0, 0); // 날개1 회전 축 설정
      wing2.rotation.set(Math.PI / 2, 0, 0); // 날개2 회전 축 설정
    }
  }, [glb]);

  useEffect(() => {
    const updateAnimation = () => {
      if (mixerRef.current) {
        const delta = clock.getDelta();
        mixerRef.current.update(delta);
      }
      requestAnimationFrame(updateAnimation);
    };

    updateAnimation();
  }, []);

  return (
    <div style={{ width: "80vw", height: "80vh", top: "10%", left: "10%" }}>
      <Canvas camera={{ position: [0, 0, -50], fov: 75 }}>
        <ambientLight intensity={3} />
        <directionalLight position={[0, 0, 5]} color="white" />

        {/* GLB 모델 렌더링 */}
        <primitive object={glb.scene} />

        {/* OrbitControls 추가 */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
