import { useEffect, useState } from "react";

import Map3D from "@/components/map3d/Map3D";



export default function Map3dPage(){
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false);
    },2000)
  },[])
  return (
    <div>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center gap-3">
          <img src="/icons/loading.svg" className="w-7 animate-spin" />
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <Map3D />
        </div>
      )}
    </div>
  );
}