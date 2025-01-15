import { useEffect,useRef } from "react";
import Map, { MapRef } from "react-map-gl";

// interface Custom3DLayerInterface extends MapboxCustomLayerInterface {
//   scene?: THREE.Scene;
//   camera?: THREE.Camera;
//   renderer?: THREE.WebGLRenderer;
// }
export default function Map3D() {
  const mapRef = useRef<MapRef>(null); //맵 인스턴스 접근

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.on("style.load", () => {
      // 지도 스타일이 로드된 후에 추가 작업 수행
      //TODO: 맵 조작
      // 커스텀 레이어 추가
      // const customLayer: Custom3DLayerInterface = {
      //   id: "3d-model",
      //   type: "custom",
      //   renderingMode: "3d",
      //   onAdd: function (map: any, gl: any) {
      //     // Three.js 설정
      //     this.scene = new THREE.Scene();
      //     this.camera = new THREE.Camera();
      //     this.renderer = new THREE.WebGLRenderer({
      //       canvas: map.getCanvas(),
      //       context: gl,
      //       antialias: true,
      //     });
      //     const geometry = new THREE.BoxGeometry(50, 50, 50);
      //     const material = new THREE.MeshBasicMaterial({ color: "blue" });
      //     const cube = new THREE.Mesh(geometry, material);
      //     this.scene.add(cube);
      //   },
      //   render: function (gl, matrix: number[]) {
      //     if (!this.scene || !this.camera || !this.renderer) return;

      //     const m = new THREE.Matrix4().fromArray(matrix);
      //     this.camera.projectionMatrix.copy(m);

      //     this.renderer.state.reset();
      //     this.renderer.render(this.scene, this.camera);
      //   },
      // } 
      // map.addLayer(customLayer);

    });
  }, []);
  
  return (
    <div className="fixed inset-0">
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: 126.97, //경도
          latitude: 37.57, //위도
          zoom: 18,
          pitch: 45,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/standard"
      >
        {/* <Marker longitude={126.97} latitude={37.57} anchor="center"> */}
        {/* </Marker> */}
      </Map>
    </div>
  );
}
