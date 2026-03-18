/**
 * 3D Particle Background — Reusable Template
 * ============================================
 * Copy this file into your project's docs/ or public/ directory.
 * 
 * USAGE:
 *   1. Replace IMAGE_PATH below with your project's logo/image path
 *   2. Adjust CONFIG values as needed
 *   3. Add to HTML:
 *        <div id="particle-container" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;opacity:0.5;"></div>
 *        <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
 *        <script src="particle-bg.js"></script>
 *
 * REFERENCE: MUSE implementation at docs/muse-particle.js
 */

(function () {
    'use strict';

    // ─── CUSTOMIZE THESE ───────────────────────────────────
    const IMAGE_PATH = './my-logo-particle.png';  // ← Change to your project's logo
    const CONFIG = {
        particleCount: 80000,       // 50K-100K for background; 150K+ for standalone
        particleSize: 60,           // Size of each point (adjust per image detail)
        rotationSpeed: 0.0003,      // Slow rotation (0 = no rotation)
        morphSpeed: 0.008,          // Speed of scatter→image morph transition
        breathingScale: 0.02,       // Subtle breathing effect amplitude
        baseColor: { r: 1.0, g: 0.85, b: 0.4 },  // Particle tint (gold default)
        bgColor: 0x000000,          // Canvas background (transparent = 0x000000 + alpha:0)
    };
    // ───────────────────────────────────────────────────────

    const container = document.getElementById('particle-container');
    if (!container) return;

    // Wait for Three.js to load
    function waitForThree(cb) {
        if (typeof THREE !== 'undefined') return cb();
        const check = setInterval(() => {
            if (typeof THREE !== 'undefined') { clearInterval(check); cb(); }
        }, 100);
    }

    waitForThree(function () {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => initParticles(img);
        img.onerror = () => console.warn('[particle-bg] Failed to load image:', IMAGE_PATH);
        img.src = IMAGE_PATH;
    });

    function initParticles(image) {
        // Sample image pixels
        const sampleCanvas = document.createElement('canvas');
        const sampleSize = 256;
        sampleCanvas.width = sampleSize;
        sampleCanvas.height = sampleSize;
        const sctx = sampleCanvas.getContext('2d');
        sctx.drawImage(image, 0, 0, sampleSize, sampleSize);
        const imageData = sctx.getImageData(0, 0, sampleSize, sampleSize);

        // Collect bright pixels as target positions
        const targets = [];
        for (let y = 0; y < sampleSize; y++) {
            for (let x = 0; x < sampleSize; x++) {
                const i = (y * sampleSize + x) * 4;
                const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                if (brightness > 30) {
                    targets.push({
                        x: (x / sampleSize - 0.5) * 10,
                        y: -(y / sampleSize - 0.5) * 10,
                        z: (Math.random() - 0.5) * 2,
                        brightness: brightness / 255
                    });
                }
            }
        }

        // Setup Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(CONFIG.bgColor, 0);
        container.appendChild(renderer.domElement);

        // Create particles
        const count = Math.min(CONFIG.particleCount, targets.length * 3);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const targetPositions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Random initial positions (scattered)
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            // Target positions (image shape)
            const target = targets[i % targets.length];
            targetPositions[i * 3] = target.x;
            targetPositions[i * 3 + 1] = target.y;
            targetPositions[i * 3 + 2] = target.z;

            // Color with brightness variation
            colors[i * 3] = CONFIG.baseColor.r * (0.7 + target.brightness * 0.3);
            colors[i * 3 + 1] = CONFIG.baseColor.g * (0.7 + target.brightness * 0.3);
            colors[i * 3 + 2] = CONFIG.baseColor.b * (0.7 + target.brightness * 0.3);

            sizes[i] = Math.random() * 2 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: CONFIG.particleSize * 0.01,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Animation
        let morphProgress = 0;
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);

            // Skip if tab not visible
            if (document.hidden) return;

            time += 0.01;
            morphProgress = Math.min(morphProgress + CONFIG.morphSpeed * 0.1, 1.0);

            const pos = geometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                // Lerp toward target
                pos[i3] += (targetPositions[i3] - pos[i3]) * CONFIG.morphSpeed;
                pos[i3 + 1] += (targetPositions[i3 + 1] - pos[i3 + 1]) * CONFIG.morphSpeed;
                pos[i3 + 2] += (targetPositions[i3 + 2] - pos[i3 + 2]) * CONFIG.morphSpeed;
            }
            geometry.attributes.position.needsUpdate = true;

            // Subtle rotation
            points.rotation.y = Math.sin(time * CONFIG.rotationSpeed * 100) * 0.15;
            // Breathing
            const scale = 1 + Math.sin(time * 0.5) * CONFIG.breathingScale;
            points.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
})();
