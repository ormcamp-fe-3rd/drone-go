import mapboxgl from "mapbox-gl";
import { MapRef } from "react-map-gl";

import { LatLonAlt } from "@/types/latLonAlt";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

const MARKER_IMG_URL = "/images/map/droneMarker.svg";
const MARKER_WIDTH = "50px";
const MARKER_HEIGHT = "50px";
const LAYER_LINE_WIDTH = 4;

export const addMapSourceLayerMarker = (
  mapRef: React.MutableRefObject<MapRef|null>,
  latLonAlt: LatLonAlt[],
  positionData: FormattedTelemetryPositionData[]|null,
  markerRef: React.MutableRefObject<mapboxgl.Marker | null>,
) => {
  // if (!mapRef.current || !latLonAlt || !positionData) return;
  if(!mapRef.current || !positionData) return;
  const map = mapRef.current.getMap();
  const pathCoordinates = latLonAlt.map((point) => [point.lon, point.lat]);

  if (map.getSource("route")) {
    map.removeLayer("route-line");
    map.removeSource("route");
  }

  map.addSource("route", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: pathCoordinates,
          },
          properties: {},
        },
      ],
    },
  });

  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-width": LAYER_LINE_WIDTH,
      "line-color": "#007cbf",
    },
  });

  if(!markerRef.current){
    markerRef.current = new mapboxgl.Marker({
      element: createMarkerElement(MARKER_IMG_URL),
    });
  }
  markerRef.current.setLngLat([positionData[0].payload.lon, positionData[0].payload.lat])
  .addTo(map);
    
    setTimeout(() => {
    const source = map.getSource("route") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: pathCoordinates,
            },
            properties: {},
          },
        ],
      });
    }
  }, 500);

};

function createMarkerElement(imageUrl: string) {
  const element = document.createElement("img");
  element.src = imageUrl;
  element.style.width = MARKER_WIDTH;
  element.style.height = MARKER_HEIGHT;
  element.style.objectFit = "contain";
  return element;
}