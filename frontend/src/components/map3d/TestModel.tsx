import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

const MyMesh = () => {
  const refMesh = useRef<Mesh>(null);

  // useFrame(()=>{
  //   if(!refMesh.current)return
  //   refMesh.current.rotation.y += 0.01;
  // });
  return (
    <mesh
      ref={refMesh}
      position={[0, 0, 0]}
      rotation={[Math.PI / 4,0,0]} 
    >
      <boxGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color="blue" />
      <ambientLight intensity={3} />
    </mesh>
  );
}

export default function TestModel(){


  return (
    <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 200] }}
      >
        {/* <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, -Math.PI / 1, 0]}>
          <boxGeometry args={[100, 100, 100]} />
          <meshStandardMaterial color="blue" />
          <ambientLight intensity={3} />
        </mesh> */}
        <MyMesh />
      </Canvas>
    </div>
  );
}