import mapboxgl from "mapbox-gl";
import { MapRef } from "react-map-gl";

import { LatLonAlt } from "@/types/latLonAlt";
import { FormattedTelemetryPositionData } from "@/types/telemetryPositionDataTypes";

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
      "line-width": 4,
      "line-color": "#007cbf",
    },
  });

  if(!markerRef.current){
    markerRef.current = new mapboxgl.Marker({
      element: createMarkerElement("/images/map/droneMarker.svg"),
    })
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
  element.style.width = "50px";
  element.style.height = "50px";
  element.style.objectFit = "contain";
  return element;
}