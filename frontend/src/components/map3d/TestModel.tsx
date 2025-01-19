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
  const rotateXRef = useRef<number>(-Math.PI / 4); // 초기값 설정
  const rotateYRef = useRef<number>(0);

  const INITIAL_ROTATE_X = -Math.PI / 4;
  const ROTATION_MULTIPLIER = Math.PI * 0.25;


  
  useFrame((_, delta) => {
    if (!dragPosition || !mapRef.current) return;
    console.log("use Frame: " + dragPosition.x, dragPosition.y);

    const mapContainer = mapRef.current?.getContainer();

    const x = (dragPosition.x / mapContainer.clientWidth) * 2 - 1;
    const y = (dragPosition.y / mapContainer.clientHeight) * 2 - 1;

    const targetRotateX = INITIAL_ROTATE_X + x * ROTATION_MULTIPLIER; // 회전 범위 증가
    const targetRotateY = y * ROTATION_MULTIPLIER; // 회전 범위 증가

    console.log("x: " + x + " y: " + y);

    const smoothFactor = 0.1 * delta * 60; 
    rotateXRef.current += (targetRotateX - rotateXRef.current) * smoothFactor; // 부드럽게
    rotateYRef.current += (targetRotateY - rotateYRef.current) * smoothFactor;

    if(refMesh.current){
      refMesh.current.rotation.x = rotateXRef.current;
      refMesh.current.rotation.y = rotateYRef.current;
    }
  });

  return (
    <mesh ref={refMesh} position={[0, 0, 0]}>
      <boxGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color="blue" />
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