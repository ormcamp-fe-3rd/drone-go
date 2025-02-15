import * as Cesium from 'cesium';

const CESIUM_BUILDING_TILESET_ID = 96188;
const BUILDING_MAX_SCREEN_SPACE_ERROR = 16;

export const initCesiumMap = async (
  viewerRef: React.MutableRefObject<Cesium.Viewer | null>,
  cesiumContainerRef: React.MutableRefObject<HTMLDivElement | null>,
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_API_KEY;
    const terrainProvider = await Cesium.createWorldTerrainAsync();

    if (viewerRef.current) {
      viewerRef.current.destroy();
    }
    if (!cesiumContainerRef.current) return;
    viewerRef.current = new Cesium.Viewer(cesiumContainerRef.current, {
      terrainProvider,
      animation: false,
      timeline: false,
      homeButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      geocoder: false,
      infoBox: false,
      navigationInstructionsInitiallyVisible: false,
      baseLayerPicker: false,
      vrButton: false,
      projectionPicker: false,
      shouldAnimate: true,
    });

    const buildingTileset = await Cesium.Cesium3DTileset.fromIonAssetId(
      CESIUM_BUILDING_TILESET_ID,
      {
        maximumScreenSpaceError: BUILDING_MAX_SCREEN_SPACE_ERROR,
      },
    );

    viewerRef.current.scene.primitives.add(buildingTileset);
    viewerRef.current.scene.screenSpaceCameraController.minimumZoomDistance = 50;

    setIsInitialized(true);
  } catch (error) {
    console.error("Failed to initialize Cesium:", error);
  }
};
