import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// 1. 장면(Scene), 카메라(Camera), 렌더러(Renderer) 생성
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. 조명 추가
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// 3. FBX 로더로 모델 로드
const loader = new FBXLoader();
loader.load(
  "./models/model.fbx", // FBX 파일 경로
  (fbx) => {
    // FBX 모델 로드 완료 시
    fbx.scale.set(0.01, 0.01, 0.01); // 모델 크기 조정
    scene.add(fbx);
  },
  (xhr) => {
    // 로드 진행 상황
    console.log(`FBX 로드 진행: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    // 에러 처리
    console.error("FBX 로드 실패:", error);
  },
);

// 4. 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// 5. 창 크기 변경 시 처리
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
