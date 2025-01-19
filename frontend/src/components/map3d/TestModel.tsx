import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MapRef } from "react-map-gl";
import { Mesh } from "three";

interface Props {
  dragPosition: {
    x: number;
    y: number;
  } | null;
  mapRef: React.RefObject<MapRef>;
}

const MyMesh = ({dragPosition, mapRef}:Props) => {
  const refMesh = useRef<Mesh>(null);
  const rotateXRef = useRef<number>(0); 
  const rotateYRef = useRef<number>(0);

  const ROTATION_MULTIPLIER = Math.PI * 0.9;
  
  useFrame(() => {
    if (!dragPosition || !mapRef.current) return;

    // 화면 좌표를 -1~1로 변환
    const mapContainer = mapRef.current.getContainer();
    const x = (dragPosition.x / mapContainer.clientWidth) * 2 - 1;
    const y = -(dragPosition.y / mapContainer.clientHeight) * 2 + 1;

    // 회전 범위 증가
    if(!refMesh.current) return;
    const targetRotateX = refMesh.current.rotation.x + y * ROTATION_MULTIPLIER;
    const targetRotateY = refMesh.current.rotation.y + x * ROTATION_MULTIPLIER;


    // 부드럽게
    rotateXRef.current += (targetRotateX - rotateXRef.current) * 0.1;
    rotateYRef.current += (targetRotateY - rotateYRef.current) * 0.1;

    // 회전
    if (refMesh.current) {
      refMesh.current.rotation.x = rotateXRef.current;
      refMesh.current.rotation.y = rotateYRef.current;
    }
  });

  return (
    <mesh ref={refMesh} position={[0, 0, 0]} rotation={[-Math.PI / 4,0,0]}>
      <boxGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color="blue" wireframe={true}/>
      <ambientLight intensity={5} />
    </mesh>
  );
}

export default function TestModel({dragPosition, mapRef}:Props){
  return (
    <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 200] }}
      >
        <MyMesh dragPosition={dragPosition} mapRef={mapRef}/>
      </Canvas>
    </div>
  );
}