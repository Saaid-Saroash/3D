// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle System Configurations
const particleCount = 500;
const sphereRadius = 5;

// BroadcastChannel for synchronization
const channel = new BroadcastChannel('particle_system');

// Green Sphere Particles
const greenParticles = new THREE.BufferGeometry();
const greenPositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();

    const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
    const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
    const z = sphereRadius * Math.cos(phi);

    greenPositions[i * 3] = x;
    greenPositions[i * 3 + 1] = y;
    greenPositions[i * 3 + 2] = z;
}

greenParticles.setAttribute('position', new THREE.BufferAttribute(greenPositions, 3));
const greenMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
const greenSphere = new THREE.Points(greenParticles, greenMaterial);
scene.add(greenSphere);

// Red Sphere Particles
const redParticles = new THREE.BufferGeometry();
const redPositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();

    const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
    const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
    const z = sphereRadius * Math.cos(phi);

    redPositions[i * 3] = x;
    redPositions[i * 3 + 1] = y;
    redPositions[i * 3 + 2] = z;
}

redParticles.setAttribute('position', new THREE.BufferAttribute(redPositions, 3));
const redMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
const redSphere = new THREE.Points(redParticles, redMaterial);
scene.add(redSphere);

// Camera Position
camera.position.z = 20;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate spheres
    greenSphere.rotation.y += 0.005;
    redSphere.rotation.y -= 0.005;

    // Send data to other windows
    channel.postMessage({
        greenPositions: Array.from(greenPositions),
        redPositions: Array.from(redPositions)
    });

    renderer.render(scene, camera);
}

animate();

// Listen for updates from other windows
channel.onmessage = (event) => {
    const data = event.data;

    // Update green sphere positions
    greenPositions.set(data.greenPositions);
    greenParticles.attributes.position.needsUpdate = true;

    // Update red sphere positions
    redPositions.set(data.redPositions);
    redParticles.attributes.position.needsUpdate = true;
};

// Responsive Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
