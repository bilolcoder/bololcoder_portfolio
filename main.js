// 1. Three.js Background (Silliq harakatlanuvchi shar)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.IcosahedronGeometry(10, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff88, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

camera.position.z = 25;

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

// 2. GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.from(".main-title", { opacity: 0, y: 100, duration: 1.5, ease: "power4.out" });
gsap.from(".card", {
    scrollTrigger: { trigger: "#about", start: "top 80%" },
    opacity: 0, y: 50, stagger: 0.2, duration: 1
});

gsap.from(".project-item", {
    scrollTrigger: { trigger: "#projects", start: "top 70%" },
    scale: 0.8, opacity: 0, stagger: 0.2, duration: 1
});
