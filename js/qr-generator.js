/**
 * QR Code Generator - JavaScript functionality
 * Creates customizable QR codes for various content types
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrContent = document.getElementById('qr-content');
    const qrType = document.getElementById('qr-type');
    const qrSize = document.getElementById('qr-size');
    const qrForeground = document.getElementById('qr-foreground');
    const qrBackground = document.getElementById('qr-background');
    const qrErrorCorrection = document.getElementById('qr-error-correction');
    const generateBtn = document.getElementById('generate-btn');
    const qrResult = document.getElementById('qr-result');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    
    // Initialize the QR Generator
    function initQRGenerator() {
        // Set up event listeners
        setupEventListeners();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'qr-generator');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Generate button click
        generateBtn.addEventListener('click', generateQRCode);
        
        // Download buttons click
        downloadPngBtn.addEventListener('click', () => downloadQRCode('png'));
        downloadSvgBtn.addEventListener('click', () => downloadQRCode('svg'));
        
        // Content type change
        qrType.addEventListener('change', updateContentPlaceholder);
        
        // Allow Enter key to trigger generation
        qrContent.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateQRCode();
            }
        });
    }
    
    // Initialize mobile menu
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // Update placeholder based on content type
    function updateContentPlaceholder() {
        const type = qrType.value;
        let placeholder = '';
        
        switch (type) {
            case 'url':
                placeholder = 'https://example.com';
                break;
            case 'text':
                placeholder = 'Enter your text here...';
                break;
            case 'email':
                placeholder = 'email@example.com';
                break;
            case 'phone':
                placeholder = '+1234567890';
                break;
            case 'sms':
                placeholder = '+1234567890: Your message here';
                break;
            case 'vcard':
                placeholder = 'BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD';
                break;
            case 'wifi':
                placeholder = 'WIFI:S:NetworkName;T:WPA;P:Password;;';
                break;
        }
        
        qrContent.placeholder = placeholder;
    }
    
    // Format content based on type
    function formatContent(content, type) {
        switch (type) {
            case 'url':
                // Add https:// if not present and not starting with http
                if (!content.startsWith('http://') && !content.startsWith('https://')) {
                    content = 'https://' + content;
                }
                return content;
            case 'email':
                return 'mailto:' + content;
            case 'phone':
                return 'tel:' + content;
            case 'sms':
                // Check if content contains a colon (separating number and message)
                if (content.includes(':')) {
                    const [number, message] = content.split(':', 2);
                    return `sms:${number}?body=${encodeURIComponent(message.trim())}`;
                }
                return 'sms:' + content;
            default:
                return content;
        }
    }
    
    // Generate QR Code
    function generateQRCode() {
        const content = qrContent.value.trim();
        if (!content) {
            showError('Please enter content for your QR code');
            return;
        }
        
        const type = qrType.value;
        const size = parseInt(qrSize.value);
        const foreground = qrForeground.value;
        const background = qrBackground.value;
        const errorCorrectionLevel = qrErrorCorrection.value;
        
        const formattedContent = formatContent(content, type);
        
        try {
            // Clear previous QR code
            qrResult.innerHTML = '';
            
            // Create QR code using QRCode.js library
            const qrcode = new QRCode(qrResult, {
                text: formattedContent,
                width: size,
                height: size,
                colorDark: foreground,
                colorLight: background,
                correctLevel: QRCode.CorrectLevel[errorCorrectionLevel]
            });
            
            // Enable download buttons
            downloadPngBtn.disabled = false;
            downloadSvgBtn.disabled = false;
        } catch (error) {
            showError('Error generating QR code: ' + error.message);
        }
    }
    
    // Download QR Code
    function downloadQRCode(format) {
        const qrImage = qrResult.querySelector('img');
        const qrCanvas = qrResult.querySelector('canvas');
        
        if (!qrImage || !qrCanvas) {
            showError('No QR code generated yet');
            return;
        }
        
        const link = document.createElement('a');
        let dataUrl;
        
        if (format === 'png') {
            // Get PNG data URL from canvas
            dataUrl = qrCanvas.toDataURL('image/png');
            link.download = 'qrcode.png';
        } else if (format === 'svg') {
            // Create SVG from canvas
            const size = parseInt(qrSize.value);
            const foreground = qrForeground.value;
            const background = qrBackground.value;
            
            // Get image data from canvas
            const ctx = qrCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
            const data = imageData.data;
            
            // Create SVG
            let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${qrCanvas.width} ${qrCanvas.height}">`;
            
            // Add background
            svg += `<rect width="100%" height="100%" fill="${background}"/>`;
            
            // Add QR code modules
            const moduleSize = qrCanvas.width / Math.sqrt(data.length / 4);
            
            for (let y = 0; y < qrCanvas.height; y += moduleSize) {
                for (let x = 0; x < qrCanvas.width; x += moduleSize) {
                    const pixelIndex = (Math.floor(y) * qrCanvas.width + Math.floor(x)) * 4;
                    // If pixel is dark (QR code module)
                    if (data[pixelIndex] === 0) {
                        svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${foreground}"/>`;
                    }
                }
            }
            
            svg += '</svg>';
            
            // Convert SVG to data URL
            dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
            link.download = 'qrcode.svg';
        }
        
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Show error message
    function showError(message) {
        qrResult.innerHTML = `<p class="text-red-500 text-center">${message}</p>`;
        downloadPngBtn.disabled = true;
        downloadSvgBtn.disabled = true;
    }
    
    // Initialize the tool
    initQRGenerator();
});

// Add QR Generator 3D Icon to Tool3DIcon object
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.createQrGeneratorIcon = function(scene, colors) {
        const group = new THREE.Group();
        
        // Create a QR code frame
        const createQRFrame = () => {
            const frame = new THREE.Group();
            
            // Create a frame background
            const frameBg = new THREE.Mesh(
                new THREE.BoxGeometry(2.4, 2.4, 0.1),
                new THREE.MeshStandardMaterial({ 
                    color: 0xFFFFFF, // White background
                    metalness: 0.1,
                    roughness: 0.8
                })
            );
            frame.add(frameBg);
            
            // Create QR code pattern
            const createQRPattern = () => {
                const pattern = new THREE.Group();
                
                // Define a simple QR code pattern (5x5 grid)
                const qrMatrix = [
                    [1, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0],
                    [1, 0, 1, 1, 1],
                    [0, 0, 0, 1, 0],
                    [1, 1, 0, 1, 1]
                ];
                
                const moduleSize = 0.3;
                const startX = -0.9;
                const startY = 0.9;
                
                // Create QR code modules
                for (let row = 0; row < qrMatrix.length; row++) {
                    for (let col = 0; col < qrMatrix[row].length; col++) {
                        if (qrMatrix[row][col] === 1) {
                            const module = new THREE.Mesh(
                                new THREE.BoxGeometry(moduleSize, moduleSize, 0.05),
                                new THREE.MeshStandardMaterial({ 
                                    color: 0x000000, // Black modules
                                    metalness: 0.1,
                                    roughness: 0.8
                                })
                            );
                            module.position.set(
                                startX + col * moduleSize,
                                startY - row * moduleSize,
                                0.08
                            );
                            pattern.add(module);
                        }
                    }
                }
                
                // Add position detection patterns (the three large squares in corners)
                const createPositionPattern = (x, y) => {
                    const posPattern = new THREE.Group();
                    
                    // Outer square
                    const outerSquare = new THREE.Mesh(
                        new THREE.BoxGeometry(moduleSize * 3, moduleSize * 3, 0.05),
                        new THREE.MeshStandardMaterial({ color: 0x000000 })
                    );
                    outerSquare.position.set(x, y, 0.08);
                    posPattern.add(outerSquare);
                    
                    // Inner square (white)
                    const innerSquare = new THREE.Mesh(
                        new THREE.BoxGeometry(moduleSize * 1.8, moduleSize * 1.8, 0.06),
                        new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
                    );
                    innerSquare.position.set(x, y, 0.09);
                    posPattern.add(innerSquare);
                    
                    // Center square (black)
                    const centerSquare = new THREE.Mesh(
                        new THREE.BoxGeometry(moduleSize * 0.9, moduleSize * 0.9, 0.07),
                        new THREE.MeshStandardMaterial({ color: 0x000000 })
                    );
                    centerSquare.position.set(x, y, 0.1);
                    posPattern.add(centerSquare);
                    
                    return posPattern;
                };
                
                // Add the three position patterns
                pattern.add(createPositionPattern(startX + moduleSize, startY - moduleSize)); // Top-left
                pattern.add(createPositionPattern(startX + moduleSize * 4, startY - moduleSize)); // Top-right
                pattern.add(createPositionPattern(startX + moduleSize, startY - moduleSize * 4)); // Bottom-left
                
                return pattern;
            };
            
            frame.add(createQRPattern());
            return frame;
        };
        
        // Create a base for the QR code
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.3, 2.5),
            new THREE.MeshStandardMaterial({ 
                color: 0x3B82F6, // Primary blue
                metalness: 0.3,
                roughness: 0.7
            })
        );
        base.position.y = -1.2;
        group.add(base);
        
        // Add the QR code frame
        const qrFrame = createQRFrame();
        group.add(qrFrame);
        
        // Add a scanning effect
        const createScanEffect = () => {
            const scanLine = new THREE.Mesh(
                new THREE.PlaneGeometry(2.2, 0.05),
                new THREE.MeshBasicMaterial({ 
                    color: 0x10B981, // Secondary green
                    transparent: true,
                    opacity: 0.7
                })
            );
            scanLine.position.z = 0.15;
            
            // Animate the scan line
            const animateScanLine = () => {
                scanLine.position.y = 1;
                
                // Create animation
                const scanAnimation = gsap.timeline({ repeat: -1 });
                scanAnimation.to(scanLine.position, { 
                    y: -1, 
                    duration: 1.5, 
                    ease: 'power1.inOut'
                });
                scanAnimation.to(scanLine.material, { 
                    opacity: 0.3, 
                    duration: 0.75, 
                    yoyo: true, 
                    repeat: 1,
                    ease: 'power1.inOut'
                }, 0);
            };
            
            animateScanLine();
            return scanLine;
        };
        
        group.add(createScanEffect());
        
        scene.add(group);
        return group;
    };
}