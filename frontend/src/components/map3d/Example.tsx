import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MapRef } from "react-map-gl";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MapboxExample: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement|null>(null);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/light-v11",
      zoom: 18,
      center: [148.9819, -35.3981],
      pitch: 60,
      antialias: true,
    });

    const modelOrigin:[number, number] = [148.9819, -35.39847];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude,
    );

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    const createCustomLayer = (
      map: mapboxgl.Map,
    ): mapboxgl.CustomLayerInterface => {
      const camera = new THREE.Camera();
      const scene = new THREE.Scene();

      const directionalLight1 = new THREE.DirectionalLight(0xffffff);
      directionalLight1.position.set(0, -70, 100).normalize();
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      scene.add(directionalLight2);

      const loader = new GLTFLoader();
      loader.load(
        "https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf",
        (gltf) => {
          scene.add(gltf.scene);
        },
      );

      const renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: map.painter.context.gl,
        antialias: true,
      });

      renderer.autoClear = false;

      return {
        id: "3d-model",
        type: "custom",
        renderingMode: "3d",
        onAdd: () => {
          // Add logic that runs on layer addition if necessary.
        },
        render: (gl: WebGLRenderingContext, matrix: number[]) => {
          const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX,
          );
          const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY,
          );
          const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ,
          );

          const m = new THREE.Matrix4().fromArray(matrix);
          const l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ,
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale,
              ),
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          camera.projectionMatrix = m.multiply(l);
          renderer.resetState();
          renderer.render(scene, camera);
          map.triggerRepaint();
        },
      };
    };

    map.on("style.load", () => {
      const customLayer = createCustomLayer(map);
      map.addLayer(customLayer, "waterway-label");
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }}></div>
  );
};

export default MapboxExample;
