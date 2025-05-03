/**
 * Password Generator - JavaScript functionality
 * Provides secure password generation with customizable options
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordLengthSlider = document.getElementById('password-length');
    const lengthValueDisplay = document.getElementById('length-value');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const excludeSimilar = document.getElementById('exclude-similar');
    const generateBtn = document.getElementById('generate-btn');
    const passwordOutput = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copy-message');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    const similarChars = 'il1Lo0O';

    // Initialize the password generator
    function initPasswordGenerator() {
        // Set up event listeners
        passwordLengthSlider.addEventListener('input', updateLengthDisplay);
        generateBtn.addEventListener('click', generatePassword);
        copyBtn.addEventListener('click', copyToClipboard);
        
        // Initialize 3D icon
        initToolIcon();
        
        // Generate initial password
        generatePassword();
    }

    // Update the displayed length value
    function updateLengthDisplay() {
        lengthValueDisplay.textContent = passwordLengthSlider.value;
    }

    // Generate a password based on selected options
    function generatePassword() {
        // Get the password length
        const length = parseInt(passwordLengthSlider.value);
        
        // Check that at least one character type is selected
        if (!includeUppercase.checked && !includeLowercase.checked && 
            !includeNumbers.checked && !includeSymbols.checked) {
            // Default to lowercase if nothing is selected
            includeLowercase.checked = true;
        }
        
        // Build character pool based on selected options
        let charPool = '';
        
        if (includeUppercase.checked) {
            charPool += uppercaseChars;
        }
        
        if (includeLowercase.checked) {
            charPool += lowercaseChars;
        }
        
        if (includeNumbers.checked) {
            charPool += numberChars;
        }
        
        if (includeSymbols.checked) {
            charPool += symbolChars;
        }
        
        // Remove similar characters if option is selected
        if (excludeSimilar.checked) {
            for (let i = 0; i < similarChars.length; i++) {
                charPool = charPool.replace(similarChars[i], '');
            }
        }
        
        // Generate the password
        let password = '';
        const charPoolLength = charPool.length;
        
        // Ensure we have at least one character from each selected type
        let requiredChars = '';
        
        if (includeUppercase.checked) {
            requiredChars += getRandomChar(uppercaseChars);
        }
        
        if (includeLowercase.checked) {
            requiredChars += getRandomChar(lowercaseChars);
        }
        
        if (includeNumbers.checked) {
            requiredChars += getRandomChar(numberChars);
        }
        
        if (includeSymbols.checked) {
            requiredChars += getRandomChar(symbolChars);
        }
        
        // Add required characters
        password = requiredChars;
        
        // Fill the rest of the password with random characters
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPoolLength);
            password += charPool[randomIndex];
        }
        
        // Shuffle the password to ensure required characters aren't always at the beginning
        password = shuffleString(password);
        
        // Display the generated password
        passwordOutput.value = password;
        
        // Update password strength indicator
        updatePasswordStrength(password);
    }

    // Get a random character from a string
    function getRandomChar(charSet) {
        return charSet[Math.floor(Math.random() * charSet.length)];
    }

    // Shuffle a string
    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    // Copy password to clipboard
    function copyToClipboard() {
        passwordOutput.select();
        document.execCommand('copy');
        
        // Show copy confirmation message
        copyMessage.classList.remove('hidden');
        
        // Hide message after 2 seconds
        setTimeout(() => {
            copyMessage.classList.add('hidden');
        }, 2000);
    }

    // Update password strength indicator
    function updatePasswordStrength(password) {
        // Calculate password strength score (0-100)
        const length = password.length;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        const hasRepeatingChars = /(.)\1{2,}/.test(password); // 3+ repeating characters
        
        let score = 0;
        
        // Length score (up to 40 points)
        score += Math.min(length * 2.5, 40);
        
        // Character variety score (up to 40 points)
        if (hasUppercase) score += 10;
        if (hasLowercase) score += 10;
        if (hasNumbers) score += 10;
        if (hasSymbols) score += 10;
        
        // Penalty for repeating characters
        if (hasRepeatingChars) score -= 10;
        
        // Ensure score is between 0-100
        score = Math.max(0, Math.min(score, 100));
        
        // Update strength bar
        strengthBar.style.width = `${score}%`;
        
        // Set color based on score
        if (score < 40) {
            strengthBar.className = 'bg-red-500 h-2.5 rounded-full';
            strengthText.textContent = 'Weak';
            strengthText.className = 'text-sm text-red-500';
        } else if (score < 70) {
            strengthBar.className = 'bg-yellow-500 h-2.5 rounded-full';
            strengthText.textContent = 'Moderate';
            strengthText.className = 'text-sm text-yellow-600';
        } else {
            strengthBar.className = 'bg-green-500 h-2.5 rounded-full';
            strengthText.textContent = 'Strong';
            strengthText.className = 'text-sm text-green-600';
        }
    }

    // Initialize 3D lock icon
    function initToolIcon() {
        // Check if the tool-3d-icon element exists
        const iconContainer = document.getElementById('tool-3d-icon');
        if (!iconContainer) return;

        // Create a scene
        const scene = new THREE.Scene();
        
        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
        
        // Create a renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(64, 64);
        iconContainer.appendChild(renderer.domElement);
        
        // Create a lock body (cylinder)
        const lockBodyGeometry = new THREE.CylinderGeometry(1, 1, 1.5, 32);
        const lockBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3B82F6, metalness: 0.7, roughness: 0.2 });
        const lockBody = new THREE.Mesh(lockBodyGeometry, lockBodyMaterial);
        lockBody.position.y = -0.5;
        scene.add(lockBody);
        
        // Create a lock shackle (torus)
        const shackleGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 32, Math.PI);
        const shackleMaterial = new THREE.MeshStandardMaterial({ color: 0x3B82F6, metalness: 0.7, roughness: 0.2 });
        const shackle = new THREE.Mesh(shackleGeometry, shackleMaterial);
        shackle.position.y = 0.8;
        shackle.rotation.x = Math.PI / 2;
        scene.add(shackle);
        
        // Create a keyhole
        const keyholeGeometry = new THREE.CircleGeometry(0.3, 32);
        const keyholeMaterial = new THREE.MeshBasicMaterial({ color: 0x1F2937 });
        const keyhole = new THREE.Mesh(keyholeGeometry, keyholeMaterial);
        keyhole.position.z = 1.01;
        keyhole.position.y = -0.5;
        scene.add(keyhole);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 5);
        scene.add(directionalLight);
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the lock
            lockBody.rotation.y += 0.01;
            shackle.rotation.y += 0.01;
            keyhole.rotation.z += 0.01;
            
            renderer.render(scene, camera);
        }
        
        // Start animation
        animate();
        
        // Add hover effect
        iconContainer.addEventListener('mouseenter', () => {
            gsap.to(lockBody.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });
            gsap.to(shackle.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });
        });
        
        iconContainer.addEventListener('mouseleave', () => {
            gsap.to(lockBody.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            gsap.to(shackle.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        });
    }

    // Initialize the password generator
    initPasswordGenerator();
});