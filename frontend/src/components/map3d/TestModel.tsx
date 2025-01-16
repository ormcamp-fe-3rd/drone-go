import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Mesh } from "three";

interface Props {
  dragPosition: {
    x: number;
    y: number;
  } | null;
}

const MyMesh = ({dragPosition}:Props) => {
  const refMesh = useRef<Mesh>(null);
  const [rotation, setRotation] = useState<[number, number, number]>();

  useEffect(()=>{
    console.log("i'm mesh")
    setRotation([-Math.PI/4, 0, 0])

  },[])
  useFrame(()=>{
    if(!dragPosition)return
    console.log("use Frame: "+dragPosition);
    setRotation([dragPosition.x, dragPosition.y, 0])
  });

  return (
    <mesh
      ref={refMesh}
      position={[0, 0, 0]}
      rotation={rotation} 
    >
      <boxGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color="blue" />
      <ambientLight intensity={3} />
    </mesh>
  );
}

export default function TestModel({dragPosition}:Props){
  
  return (
    <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 200] }}
      >
        <MyMesh dragPosition={dragPosition}/>
      </Canvas>
    </div>
  );
}