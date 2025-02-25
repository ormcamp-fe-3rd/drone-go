import * as Cesium from "cesium";


export const updateDronePosition = (
  currentPhase: number,
  pathPositions: Cesium.Cartesian3[] | undefined,
  modelEntityRef: React.MutableRefObject<Cesium.Entity | null>,
  viewerRef: React.MutableRefObject<Cesium.Viewer | null>,
  attitudeData: {payload: {roll: number, pitch: number, yaw: number}}[] | null
) => {
  if (!viewerRef.current || !pathPositions || !modelEntityRef.current || !attitudeData)
    return;

  const pathIndex = Math.min(
    Math.floor(currentPhase * (pathPositions.length - 1)),
    pathPositions.length - 1,
  );
  const attitudeIndex = Math.min(
    Math.floor(currentPhase * (attitudeData.length -1)),
    attitudeData.length - 1,
  );

  if (!pathPositions[pathIndex]) return;

  // 위치 업데이트
  const currentPosition = pathPositions[pathIndex];
  modelEntityRef.current.position = new Cesium.ConstantPositionProperty(
    currentPosition,
  );


  if (pathIndex < pathPositions.length - 1) {
    const nextPosition = pathPositions[pathIndex + 1];

    // 현재 위치와 다음 위치를 카르토그래픽(경도/위도/높이) 좌표로 변환
    const currentCartographic =
      Cesium.Cartographic.fromCartesian(currentPosition);
    const nextCartographic = Cesium.Cartographic.fromCartesian(nextPosition);

    // 측지선(geodesic) 속성을 사용하여 헤딩 계산
    const geodesic = new Cesium.EllipsoidGeodesic(
      new Cesium.Cartographic(
        currentCartographic.longitude,
        currentCartographic.latitude,
      ),
      new Cesium.Cartographic(
        nextCartographic.longitude,
        nextCartographic.latitude,
      ),
    );

    const distance = geodesic.surfaceDistance; //단위:미터

    const currentAttitude = attitudeData[attitudeIndex].payload;
    const rollRadians = currentAttitude.roll;
    const pitchRadians = currentAttitude.pitch;

    if (distance >= 1) {
      const heading = geodesic.startHeading;
      const hpr = new Cesium.HeadingPitchRoll(
        heading,
        rollRadians,
        pitchRadians,
      );
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        currentPosition,
        hpr,
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
