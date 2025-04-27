// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particle System
const particleCount = 1000; // Number of particles
const radius = 8; // Radius of the sphere
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    // Generate random points on a sphere
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: Math.random() > 0.5 ? 0x00ff00 : 0xff0000, // Randomly green or red
    transparent: true,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Camera Position
camera.position.z = 15;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    const positions = particles.getAttribute('position');
    const velocities = particles.getAttribute('velocity');

    for (let i = 0; i < particleCount; i++) {
        positions.array[i * 3] += velocities.array[i * 3];
        positions.array[i * 3 + 1] += velocities.array[i * 3 + 1];
        positions.array[i * 3 + 2] += velocities.array[i * 3 + 2];

        // Bounce back if particles go out of bounds
        if (positions.array[i * 3] > radius || positions.array[i * 3] < -radius) {
            velocities.array[i * 3] *= -1;
        }
        if (positions.array[i * 3 + 1] > radius || positions.array[i * 3 + 1] < -radius) {
            velocities.array[i * 3 + 1] *= -1;
        }
        if (positions.array[i * 3 + 2] > radius || positions.array[i * 3 + 2] < -radius) {
            velocities.array[i * 3 + 2] *= -1;
        }
    }

    positions.needsUpdate = true;

    // Rotate the particle system for effect
    particleSystem.rotation.y += 0.002;
    particleSystem.rotation.x += 0.001;

    renderer.render(scene, camera);
}

animate();

// Responsive Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});