import * as Cesium from "cesium";
import { degToRad } from "three/src/math/MathUtils";

const adjustDroneHeading = degToRad(216);

export const updateDronePosition = (
  currentPhase: number,
  pathPositions: Cesium.Cartesian3[] | undefined,
  modelEntityRef: React.MutableRefObject<Cesium.Entity | null>,
  viewerRef: React.MutableRefObject<Cesium.Viewer | null>
) => {
  if (!viewerRef.current || !pathPositions || !modelEntityRef.current)
    return;

  const index = Math.min(
    Math.floor(currentPhase * (pathPositions.length - 1)),
    pathPositions.length - 1,
  );

  if (!pathPositions[index]) return;

  // 위치 업데이트
  const currentPosition = pathPositions[index]
  modelEntityRef.current.position = new Cesium.ConstantPositionProperty(
    currentPosition,
  );

  // 방향 계산 및 업데이트
  if (index > 0) {
    const prevPosition = pathPositions[index-1]
    const direction = Cesium.Cartesian3.subtract(
      currentPosition,
      prevPosition,
      new Cesium.Cartesian3(),
    );

    if (Cesium.Cartesian3.magnitudeSquared(direction) > 0) {
      Cesium.Cartesian3.normalize(direction, direction);
      const heading = Math.atan2(direction.y, direction.x);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        currentPosition,
        new Cesium.HeadingPitchRoll(heading + adjustDroneHeading, 0, 0),
      );
      modelEntityRef.current.orientation = new Cesium.ConstantProperty(
        orientation,
      );
    }
  }

  // 카메라 업데이트
  if (currentPhase >0 && !viewerRef.current.trackedEntity) {
    viewerRef.current.trackedEntity = modelEntityRef.current;
  }
  
  //초기 카메라 위치 설정
  if (currentPhase === 0 ) {
    viewerRef.current.trackedEntity = undefined;
    const camera = viewerRef.current.scene.camera;
    const cartographic = Cesium.Cartographic.fromCartesian(pathPositions[0]);
    const initialPosition = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height + 500,
    );
    camera.setView({
      destination: initialPosition,
      orientation: {
        heading: 0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0,
      },
    });
  }
}
