// Enhanced 3D Effects for Essential Tools Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize glow effects
    initGlowEffects();
    
    // Initialize 3D hover effects for cards
    init3DCardEffects();
    
    // Initialize 3D tool containers if they exist
    initTool3DContainers();
});

// Add glow effect to elements with glow-effect class
function initGlowEffects() {
    const glowElements = document.querySelectorAll('.card, .tool-container, .faq-item');
    
    glowElements.forEach(element => {
        element.classList.add('glow-effect');
        
        // Add mouse move effect for dynamic glow
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate the position of the glow relative to the element
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const percentX = (x - centerX) / centerX * 100;
            const percentY = (y - centerY) / centerY * 100;
            
            // Apply the glow position
            element.style.setProperty('--glow-x', `${percentX}%`);
            element.style.setProperty('--glow-y', `${percentY}%`);
        });
    });
}

// Add 3D tilt effect to cards
function init3DCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 10; // Max 10 degrees
            const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees
            
            // Apply the 3D rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        
        // Remove transition on mouse enter for smooth movement
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

// Initialize 3D containers for tool pages
function initTool3DContainers() {
    const containers = document.querySelectorAll('.tool-3d-container');
    
    containers.forEach(container => {
        // Get the tool type from data attribute or default to generic
        const toolType = container.dataset.toolType || 'generic';
        
        // Initialize the 3D icon if Three.js is available
        if (window.THREE && window.Essential3D) {
            window.Essential3D.createToolIcon(container, toolType);
        }
    });
}

// Add parallax effect to background elements
window.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.1;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        
        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// Add floating animation to elements with float class
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.float');
    
    floatingElements.forEach((element, index) => {
        // Create a unique animation delay for each element
        const delay = index * 0.2;
        const duration = 3 + Math.random() * 2;
        
        // Apply GSAP animation if available
        if (window.gsap) {
            gsap.to(element, {
                y: '-15px',
                duration: duration,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: delay
            });
        }
    });
}

// Initialize floating elements
document.addEventListener('DOMContentLoaded', initFloatingElements);

// Add color pulse effect to buttons
function initColorPulse() {
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('color-pulse');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('color-pulse');
            // Force a reflow to restart the animation next time
            void button.offsetWidth;
        });
    });
}

// Initialize color pulse effect
document.addEventListener('DOMContentLoaded', initColorPulse);