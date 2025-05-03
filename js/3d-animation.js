// 3D Animation for Essential Tools

// Initialize the scene, camera, and renderer
let scene, camera, renderer;
let colorfulObjects = [];
let animationMixer;

// Colors for the theme
const colors = [
    0x3B82F6, // primary (blue)
    0x10B981, // secondary (green)
    0x8B5CF6, // accent (purple)
    0xF59E0B, // amber
    0xEF4444, // red
    0xEC4899, // pink
    0x06B6D4, // cyan
    0x8B5CF6  // violet
];

// Particle system
let particles;
let particleCount = 100;

// Initialize the animation
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);
    scene.fog = new THREE.FogExp2(0xf9fafb, 0.035);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer with enhanced settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Make renderer transparent
    renderer.setClearColor(0x000000, 0);
    
    // Enable shadow mapping for more realistic 3D
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add renderer to the background-animation div
    const container = document.getElementById('background-animation');
    if (container) {
        container.appendChild(renderer.domElement);
        
        // Add floating objects
        createFloatingObjects();
        
        // Add particle system
        createParticles();
        
        // Enhanced lighting setup
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        // Main directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 2, 3);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        
        // Add colored point lights for dramatic effect
        const pointLight1 = new THREE.PointLight(0x3B82F6, 0.5, 10);
        pointLight1.position.set(-5, 3, 2);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x10B981, 0.5, 10);
        pointLight2.position.set(5, -3, 2);
        scene.add(pointLight2);
        
        // Start animation
        animate();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
    }
}

// Create floating objects with different geometries
function createFloatingObjects() {
    // Create different types of geometries with more detail
    const geometries = [
        new THREE.IcosahedronGeometry(0.5, 1), // Icosahedron with more detail
        new THREE.TetrahedronGeometry(0.5, 1), // Tetrahedron with more detail
        new THREE.OctahedronGeometry(0.5, 1),  // Octahedron with more detail
        new THREE.DodecahedronGeometry(0.5, 1), // Dodecahedron with more detail
        new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8, 2, 3), // TorusKnot for complex shape
        new THREE.SphereGeometry(0.4, 32, 32) // Smooth sphere
    ];
    
    // Create 25 random objects for more density
    for (let i = 0; i < 25; i++) {
        // Random geometry
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create enhanced material - use MeshStandardMaterial for more realistic rendering
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.85,
            emissive: color,
            emissiveIntensity: 0.2
        });
        
        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Add to scene and array
        scene.add(mesh);
        colorfulObjects.push({
            mesh: mesh,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.005
            }
        });
        
        // Add GSAP animation
        gsap.to(mesh.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 1 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

// Create particle system for background sparkle effect
function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 20;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 20;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        particleSizes[i] = Math.random() * 5 + 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        map: createParticleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

// Create a custom texture for particles
function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// Animation loop with enhanced effects
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001; // Current time in seconds
    
    // Rotate and move each object with more dynamic movement
    colorfulObjects.forEach(obj => {
        obj.mesh.rotation.x += obj.rotationSpeed.x;
        obj.mesh.rotation.y += obj.rotationSpeed.y;
        obj.mesh.rotation.z += obj.rotationSpeed.z;
        
        // Add sine wave motion for more organic movement
        obj.mesh.position.x += obj.floatSpeed.x;
        obj.mesh.position.y += obj.floatSpeed.y + Math.sin(time * 2 + obj.mesh.position.x) * 0.01;
        obj.mesh.position.z += obj.floatSpeed.z;
        
        // Boundary check and reverse direction if needed
        if (Math.abs(obj.mesh.position.x) > 5) obj.floatSpeed.x *= -1;
        if (Math.abs(obj.mesh.position.y) > 5) obj.floatSpeed.y *= -1;
        if (Math.abs(obj.mesh.position.z) > 5) obj.floatSpeed.z *= -1;
        
        // Pulse the objects slightly
        const pulseFactor = Math.sin(time * 3 + obj.mesh.position.y) * 0.05 + 1;
        obj.mesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
    });
    
    // Animate particles
    if (particles) {
        particles.rotation.y = time * 0.05;
        
        // Update particle sizes for twinkling effect
        const sizes = particles.geometry.attributes.size.array;
        for (let i = 0; i < particleCount; i++) {
            sizes[i] = Math.sin(time * 3 + i) * 0.5 + 1.5;
        }
        particles.geometry.attributes.size.needsUpdate = true;
    }
    
    // Subtle camera movement for immersive effect
    camera.position.x = Math.sin(time * 0.3) * 0.5;
    camera.position.y = Math.cos(time * 0.2) * 0.5;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize 3D animation when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Function to create enhanced 3D animated tool icons
function createToolIcon(container, iconType) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.05);
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Create more detailed geometry based on icon type
    let geometry, material, mesh;
    switch(iconType) {
        case 'calculator':
            // Create a more detailed calculator with buttons
            const calcGroup = new THREE.Group();
            
            // Calculator body
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2.5, 0.3),
                new THREE.MeshStandardMaterial({ 
                    color: 0x3B82F6,
                    metalness: 0.3,
                    roughness: 0.5
                })
            );
            calcGroup.add(body);
            
            // Calculator screen
            const screen = new THREE.Mesh(
                new THREE.BoxGeometry(1.6, 0.6, 0.05),
                new THREE.MeshStandardMaterial({ 
                    color: 0xECFDF5,
                    emissive: 0x10B981,
                    emissiveIntensity: 0.2,
                    metalness: 0.1,
                    roughness: 0.3
                })
            );
            screen.position.y = 0.8;
            screen.position.z = 0.18;
            calcGroup.add(screen);
            
            // Add calculator buttons
            const buttonSize = 0.3;
            const buttonColors = [0xF59E0B, 0xEF4444, 0x8B5CF6, 0x10B981];
            
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const button = new THREE.Mesh(
                        new THREE.BoxGeometry(buttonSize, buttonSize, 0.1),
                        new THREE.MeshStandardMaterial({ 
                            color: buttonColors[(i+j) % buttonColors.length],
                            metalness: 0.2,
                            roughness: 0.8
                        })
                    );
                    button.position.x = (j-1) * (buttonSize + 0.1);
                    button.position.y = (i-1) * (buttonSize + 0.1) - 0.5;
                    button.position.z = 0.18;
                    calcGroup.add(button);
                }
            }
            
            mesh = calcGroup;
            break;
            
        case 'converter':
            // Create a more interesting converter with animated rings
            const converterGroup = new THREE.Group();
            
            // Base cylinder
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(1, 1, 0.3, 32),
                new THREE.MeshStandardMaterial({ 
                    color: 0x8B5CF6,
                    metalness: 0.4,
                    roughness: 0.6
                })
            );
            converterGroup.add(base);
            
            // Add rotating rings
            const ring1 = new THREE.Mesh(
                new THREE.TorusGeometry(1.2, 0.1, 16, 100),
                new THREE.MeshStandardMaterial({ 
                    color: 0x3B82F6,
                    metalness: 0.5,
                    roughness: 0.5,
                    transparent: true,
                    opacity: 0.8
                })
            );
            ring1.rotation.x = Math.PI / 2;
            converterGroup.add(ring1);
            
            const ring2 = new THREE.Mesh(
                new THREE.TorusGeometry(1.5, 0.08, 16, 100),
                new THREE.MeshStandardMaterial({ 
                    color: 0x10B981,
                    metalness: 0.5,
                    roughness: 0.5,
                    transparent: true,
                    opacity: 0.6
                })
            );
            ring2.rotation.x = Math.PI / 4;
            ring2.rotation.y = Math.PI / 4;
            converterGroup.add(ring2);
            
            mesh = converterGroup;
            break;
            
        case 'generator':
            // Create a more complex generator with particle effect
            const genGroup = new THREE.Group();
            
            // Main torus
            const torus = new THREE.Mesh(
                new THREE.TorusKnotGeometry(1, 0.3, 128, 32, 2, 3),
                new THREE.MeshStandardMaterial({ 
                    color: 0xF59E0B,
                    metalness: 0.7,
                    roughness: 0.3,
                    emissive: 0xF59E0B,
                    emissiveIntensity: 0.2
                })
            );
            genGroup.add(torus);
            
            // Add mini particles around it
            for (let i = 0; i < 20; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.08, 16, 16),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xEC4899,
                        emissive: 0xEC4899,
                        emissiveIntensity: 0.5,
                        metalness: 1.0,
                        roughness: 0.3
                    })
                );
                
                // Position in a sphere around the torus
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI * 2;
                const radius = 1.5 + Math.random() * 0.5;
                
                particle.position.x = radius * Math.sin(theta) * Math.cos(phi);
                particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
                particle.position.z = radius * Math.cos(theta);
                
                particle.userData = {
                    theta: theta,
                    phi: phi,
                    radius: radius,
                    speed: 0.01 + Math.random() * 0.02
                };
                
                genGroup.add(particle);
            }
            
            mesh = genGroup;
            break;
            
        default:
            // Create a more detailed default icon
            geometry = new THREE.IcosahedronGeometry(1.5, 1);
            material = new THREE.MeshStandardMaterial({ 
                color: colors[Math.floor(Math.random() * colors.length)],
                metalness: 0.4,
                roughness: 0.6,
                emissive: 0x3B82F6,
                emissiveIntensity: 0.2
            });
            mesh = new THREE.Mesh(geometry, material);
    }
    
    scene.add(mesh);
    
    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add colored rim light for dramatic effect
    const rimLight = new THREE.PointLight(colors[Math.floor(Math.random() * colors.length)], 1, 10);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);
    
    // Animation function with more complex animations
    function animateIcon() {
        requestAnimationFrame(animateIcon);
        
        const time = Date.now() * 0.001; // Current time in seconds
        
        if (iconType === 'calculator') {
            // Rotate calculator gently
            mesh.rotation.x = Math.sin(time * 0.5) * 0.2;
            mesh.rotation.y += 0.005;
            
        } else if (iconType === 'converter') {
            // Rotate the rings in converter
            mesh.children[1].rotation.z += 0.01;
            mesh.children[2].rotation.z -= 0.008;
            mesh.rotation.y += 0.005;
            
        } else if (iconType === 'generator') {
            // Rotate the torus knot
            mesh.children[0].rotation.x += 0.01;
            mesh.children[0].rotation.y += 0.005;
            
            // Animate the particles
            for (let i = 1; i < mesh.children.length; i++) {
                const particle = mesh.children[i];
                const data = particle.userData;
                
                data.theta += data.speed;
                
                particle.position.x = data.radius * Math.sin(data.theta) * Math.cos(data.phi);
                particle.position.y = data.radius * Math.sin(data.theta) * Math.sin(data.phi);
                particle.position.z = data.radius * Math.cos(data.theta);
                
                // Pulse the particles
                const scale = 0.8 + Math.sin(time * 3 + i) * 0.2;
                particle.scale.set(scale, scale, scale);
            }
            
        } else {
            // Default rotation with some wobble
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
            mesh.position.y = Math.sin(time * 2) * 0.1;
        }
        
        // Move the rim light for dynamic lighting
        rimLight.position.x = Math.sin(time) * 3;
        rimLight.position.z = Math.cos(time) * 3;
        
        renderer.render(scene, camera);
    }
    
    // Start animation
    animateIcon();
    
    // Enhanced hover effects with GSAP
    container.addEventListener('mouseenter', () => {
        // Scale up with bounce effect
        gsap.to(mesh.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
        
        // Add rotation effect
        gsap.to(mesh.rotation, {
            y: mesh.rotation.y + Math.PI * 0.25,
            duration: 0.7,
            ease: "power2.out"
        });
        
        // Increase rim light intensity
        gsap.to(rimLight, {
            intensity: 2,
            distance: 15,
            duration: 0.3
        });
    });
    
    container.addEventListener('mouseleave', () => {
        // Scale back with slight bounce
        gsap.to(mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
        
        // Reset rim light
        gsap.to(rimLight, {
            intensity: 1,
            distance: 10,
            duration: 0.3
        });
    });
    
    // Add click effect
    container.addEventListener('mousedown', () => {
        gsap.to(mesh.scale, {
            x: 0.9,
            y: 0.9,
            z: 0.9,
            duration: 0.1,
            ease: "power2.in"
        });
    });
    
    container.addEventListener('mouseup', () => {
        gsap.to(mesh.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.2,
            ease: "power2.out"
        });
    });
}

// Export functions
window.Essential3D = {
    init,
    createToolIcon
};