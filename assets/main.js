import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#campus3d");
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xdff8f6, 24, 72);

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 140);
camera.position.set(8, 6, 20);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const root = new THREE.Group();
scene.add(root);

const ambient = new THREE.HemisphereLight(0xdffcff, 0xb7d9c6, 2.6);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 3.4);
sun.position.set(-9, 14, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const mat = {
  ground: new THREE.MeshStandardMaterial({ color: 0x8ed7a8, roughness: 0.85 }),
  path: new THREE.MeshStandardMaterial({ color: 0xf5d784, roughness: 0.75 }),
  school: new THREE.MeshStandardMaterial({ color: 0xf9fff9, roughness: 0.5 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x1687c8, roughness: 0.42, metalness: 0.04 }),
  window: new THREE.MeshStandardMaterial({ color: 0x6ed8f6, roughness: 0.22, metalness: 0.08 }),
  tree: new THREE.MeshStandardMaterial({ color: 0x0d8f6f, roughness: 0.7 }),
  trunk: new THREE.MeshStandardMaterial({ color: 0x8f6840, roughness: 0.8 }),
  mountain: new THREE.MeshStandardMaterial({ color: 0x7ccaa8, roughness: 0.9 }),
  coral: new THREE.MeshStandardMaterial({ color: 0xff6f61, roughness: 0.5 }),
};

function mesh(geometry, material, position, scale = [1, 1, 1]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.scale.set(...scale);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

const ground = mesh(new THREE.CylinderGeometry(14, 15, 0.7, 72), mat.ground, [3.5, -2.8, -7]);
root.add(ground);

const path = mesh(new THREE.BoxGeometry(2.2, 0.08, 16), mat.path, [0.4, -2.37, -2.5], [1, 1, 1]);
path.rotation.y = -0.35;
root.add(path);

const mainBuilding = mesh(new THREE.BoxGeometry(8.4, 3.1, 2.6), mat.school, [4.1, 0.1, -7]);
const sideBuilding = mesh(new THREE.BoxGeometry(4.1, 2.5, 2.4), mat.school, [-1.1, -0.25, -8.1]);
const roofA = mesh(new THREE.BoxGeometry(9, 0.45, 3), mat.roof, [4.1, 1.9, -7]);
const roofB = mesh(new THREE.BoxGeometry(4.5, 0.38, 2.8), mat.roof, [-1.1, 1.25, -8.1]);
root.add(mainBuilding, sideBuilding, roofA, roofB);

for (let row = 0; row < 2; row += 1) {
  for (let col = 0; col < 6; col += 1) {
    const win = mesh(new THREE.BoxGeometry(0.55, 0.5, 0.08), mat.window, [1.1 + col * 1.2, -0.55 + row * 1.1, -5.65]);
    root.add(win);
  }
}

for (let col = 0; col < 3; col += 1) {
  const win = mesh(new THREE.BoxGeometry(0.52, 0.48, 0.08), mat.window, [-2.25 + col * 1.1, -0.48, -6.84]);
  root.add(win);
}

const door = mesh(new THREE.BoxGeometry(0.8, 1.1, 0.09), mat.roof, [4.1, -1.17, -5.63]);
root.add(door);

function addTree(x, z, size = 1) {
  const trunk = mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.1, 10), mat.trunk, [x, -1.72, z], [size, size, size]);
  const crown = mesh(new THREE.IcosahedronGeometry(0.82, 1), mat.tree, [x, -0.85, z], [size, size, size]);
  root.add(trunk, crown);
}

[
  [-4.2, -3.2, 1.1],
  [-5.4, -8.4, 0.92],
  [8.7, -3.5, 1.05],
  [9.8, -8.5, 0.85],
  [1.3, -12.4, 0.9],
].forEach(([x, z, s]) => addTree(x, z, s));

for (let i = 0; i < 3; i += 1) {
  const mountain = mesh(new THREE.ConeGeometry(4.8 - i * 0.8, 5.3 - i * 0.5, 4), mat.mountain, [-7 + i * 6.2, -0.4, -22 - i]);
  mountain.rotation.y = Math.PI / 4;
  mountain.castShadow = false;
  root.add(mountain);
}

const rings = new THREE.Group();
const ringMat = new THREE.MeshStandardMaterial({ color: 0xffcb5a, roughness: 0.35, metalness: 0.1 });
for (let i = 0; i < 3; i += 1) {
  const ring = mesh(new THREE.TorusGeometry(2.1 + i * 0.75, 0.025, 12, 96), ringMat, [3.5, 2.8, -7]);
  ring.rotation.x = Math.PI / 2.7 + i * 0.24;
  ring.rotation.y = i * 0.7;
  rings.add(ring);
}
root.add(rings);

const floatingCards = new THREE.Group();
const cardGeo = new THREE.BoxGeometry(1.6, 0.9, 0.07);
const cardMaterials = [mat.tree, mat.roof, mat.coral, ringMat];
for (let i = 0; i < 8; i += 1) {
  const angle = (i / 8) * Math.PI * 2;
  const card = mesh(cardGeo, cardMaterials[i % cardMaterials.length], [Math.cos(angle) * 6 + 3.5, 2.5 + Math.sin(i) * 0.6, Math.sin(angle) * 4 - 8]);
  card.userData = { angle, speed: 0.25 + i * 0.02 };
  floatingCards.add(card);
}
root.add(floatingCards);

let pointerX = 0;
let pointerY = 0;

window.addEventListener("pointermove", (event) => {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
});

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  root.rotation.y = -0.18 + pointerX * 0.07;
  root.rotation.x = pointerY * 0.03;
  rings.rotation.y = elapsed * 0.38;
  rings.rotation.z = Math.sin(elapsed * 0.5) * 0.12;

  floatingCards.children.forEach((card, index) => {
    const orbit = elapsed * card.userData.speed + card.userData.angle;
    card.position.x = Math.cos(orbit) * 6 + 3.5;
    card.position.z = Math.sin(orbit) * 4 - 8;
    card.position.y = 2.45 + Math.sin(elapsed * 1.2 + index) * 0.45;
    card.rotation.y = -orbit + Math.PI / 2;
    card.rotation.z = Math.sin(elapsed + index) * 0.12;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const number = entry.target;
    const target = Number(number.dataset.count || 0);
    const started = performance.now();
    const duration = 900;

    function tick(now) {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      number.textContent = Math.round(target * eased).toLocaleString("ko-KR");
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    countObserver.unobserve(number);
  });
}, { threshold: 0.45 });

document.querySelectorAll("[data-count]").forEach((number) => countObserver.observe(number));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.3 });

document.querySelectorAll(".timeline-list li").forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
