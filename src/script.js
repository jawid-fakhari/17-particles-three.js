import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/******************************************
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/******************************************
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/9.png");

/******************************************
 * Particles
 */
//Custimize Particles
//Geometry
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32);
//quantità delle particelle
const count = 20000;
//creare un array Float 32
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
//randomize postion
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
//set position
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

//Material
const particlesMaterial = new THREE.PointsMaterial({
  //dimensione del particles
  size: 0.1,
  //specifica che i paricles più lontani sono più piccoli di quelli più vcini
  sizeAttenuation: true,
  //   color: 0xff88cc,
  //per fare trasparente i particelli
  transparent: true,
  alphaMap: particleTexture,
  //alpha test porta a una buona trasparenza ma non completamente
  //   alphaTest: 0.01,
  //depth test porta a 100% di trasparenza ma attenzione se hai altre geometrie
  //   depthTest: false,
  //depth write porta al 100% di trasparenza
  depthWrite: false,
  //Blending, i pixels sovrapposti avranno saturazione e sembra di aumentare la luce di di quei pixel e crea un effetto glowing come nel mondo reale quando posizioniamo diversi luci uno sul altro
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/******************************************
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/******************************************
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/******************************************
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/******************************************
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update particles
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    //la posizione del x
    const z = particlesGeometry.attributes.position.array[i3 + 2];
    const x = particlesGeometry.attributes.position.array[i3 + 0];
    //prendere la posizione del y
    particlesGeometry.attributes.position.array[i3 + 1] = -Math.sin(elapsedTime + z) * 0.2;
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime +x) * 0.2;
  }
  //fuori ciclo dobbiamo dire che la posizione deve essere aggiornato
  particlesGeometry.attributes.position.needsUpdate = true;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
