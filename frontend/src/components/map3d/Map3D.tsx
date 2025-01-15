import Map from "react-map-gl";


export default function Map3D() {
  return (
    <div className="fixed inset-0">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 17,
          pitch: 45,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/standard"
      />
    </div>
  );
}
