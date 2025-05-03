/**
 * Tool 3D Icons - JavaScript functionality
 * Creates and animates 3D icons for each tool.
 */

const Tool3DIcon = {
    // Initialize the 3D icon
    init: function(container, toolType) {
        if (!container) return;
        
        // Clear any existing content
        container.innerHTML = '';
        
        // Create the 3D scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Position camera
        camera.position.z = 5;
        
        // Create the appropriate 3D icon based on tool type
        let icon;
        let mesh;
        
        // Create the appropriate 3D icon based on tool type
        this.createToolIcon(toolType);
        
        // Add lighting
        setupLighting();
        
        // Start animation
        animate();
        
        // Create word counter icon
        function createWordCounterIcon() {
            // Create a group for the word counter icon
            const wordCounterGroup = new THREE.Group();
            
            // Create a document/paper base
            const paper = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2.6, 0.05),
                new THREE.MeshStandardMaterial({ 
                    color: 0xFFFFFF, // White paper
                    metalness: 0.1,
                    roughness: 0.8
                })
            );
            wordCounterGroup.add(paper);
            
            // Add text lines to the paper
            const lineGeometry = new THREE.BoxGeometry(1.5, 0.08, 0.02);
            const lineMaterial = new THREE.MeshStandardMaterial({ color: 0x3B82F6 }); // Blue lines
            
            // Create multiple text lines
            for (let i = 0; i < 7; i++) {
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.position.y = 0.9 - (i * 0.3);
                line.position.z = 0.04;
                
                // Vary the line lengths
                if (i % 2 === 0) {
                    line.scale.x = 0.9;
                } else if (i % 3 === 0) {
                    line.scale.x = 0.7;
                }
                
                wordCounterGroup.add(line);
            }
            
            // Add a counter/number element
            const counterBg = new THREE.Mesh(
                new THREE.CircleGeometry(0.5, 32),
                new THREE.MeshStandardMaterial({ 
                    color: 0x10B981, // Green background
                    metalness: 0.2,
                    roughness: 0.7
                })
            );
            counterBg.position.set(0.8, 0.8, 0.1);
            wordCounterGroup.add(counterBg);
            
            // Add number "123" to represent counting
            const numberGroup = new THREE.Group();
            numberGroup.position.set(0.8, 0.8, 0.15);
            
            // Create simplified "123" using small boxes
            const numMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
            
            // "1"
            const one = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.2, 0.02),
                numMaterial
            );
            one.position.x = -0.15;
            numberGroup.add(one);
            
            // "2"
            const two1 = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.02),
                numMaterial
            );
            two1.position.set(0, 0.075, 0);
            numberGroup.add(two1);
            
            const two2 = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.02),
                numMaterial
            );
            two2.position.set(0, 0, 0);
            numberGroup.add(two2);
            
            const two3 = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.02),
                numMaterial
            );
            two3.position.set(0, -0.075, 0);
            numberGroup.add(two3);
            
            // "3"
            const three1 = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.02),
                numMaterial
            );
            three1.position.set(0.2, 0.075, 0);
            numberGroup.add(three1);
            
            const three2 = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.02),
                numMaterial
            );
            three2.position.set(0.2, 0, 0);
            numberGroup.add(three2);
            
            const three3 = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.02),
                numMaterial
            );
            three3.position.set(0.2, -0.075, 0);
            numberGroup.add(three3);
            
            wordCounterGroup.add(numberGroup);
            
            // Add the word counter group to the scene
            scene.add(wordCounterGroup);
            
            // Set up animation
            gsap.to(wordCounterGroup.rotation, {
                y: Math.PI * 2,
                duration: 20,
                repeat: -1,
                ease: "none"
            });
            
            // Bounce animation for the counter
            gsap.to(counterBg.position, {
                z: 0.2,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
            
            gsap.to(numberGroup.position, {
                z: 0.25,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
            
            // Return the mesh for interaction
            mesh = wordCounterGroup;
            return wordCounterGroup;
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        // Add interactive rotation on mouse move
        container.addEventListener('mousemove', (event) => {
            const rect = container.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
            const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
            
            if (mesh) {
                // Smooth rotation following mouse position
                mesh.rotation.y = x * 1.5;
                mesh.rotation.x = y * 0.5;
            }
        });
        
        // Reset rotation when mouse leaves
        container.addEventListener('mouseleave', () => {
            if (mesh) {
                gsap.to(mesh.rotation, {
                    x: 0,
                    y: 0,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    },
    
    // Setup lighting for the scene
    setupLighting: function() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 2, 3);
        scene.add(directionalLight);
        
        // Colored rim light for dramatic effect
        const rimLight = new THREE.PointLight(colors.accent, 1, 10);
        rimLight.position.set(-3, 2, -3);
        scene.add(rimLight);
        
        // Bottom light for fill
        const fillLight = new THREE.PointLight(colors.secondary, 0.5, 10);
        fillLight.position.set(0, -3, 2);
        scene.add(fillLight);
    },
    
    // Create the appropriate 3D icon based on tool type
    createToolIcon: function(toolType) {
        let geometry, material;
        
        switch(toolType) {
            case 'flashcards':
                this.createFlashcardsIcon();
                break;
            case 'word-counter':
                this.createWordCounterIcon();
                break;
            case 'prime-number':
                if (this.createPrimeNumberIcon) {
                    mesh = this.createPrimeNumberIcon(scene, colors);
                }
                break;
            case 'roman-numeral':
                if (this.createRomanNumeralIcon) {
                    mesh = this.createRomanNumeralIcon(scene, colors);
                }
                break;
            case 'loan-calculator':
                // Create a loan/money icon for loan calculator
                const loanGroup = new THREE.Group();
                
                // Dollar bill base
                const bill = new THREE.Mesh(
                    new THREE.BoxGeometry(2.2, 1.3, 0.05),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Green color for money
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                loanGroup.add(bill);
                
                // Bill details - center circle
                const centerCircle = new THREE.Mesh(
                    new THREE.CircleGeometry(0.4, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xF3F4F6, // Light gray
                        metalness: 0.2,
                        roughness: 0.7
                    })
                );
                centerCircle.position.z = 0.03;
                loanGroup.add(centerCircle);
                
                // Dollar sign
                const dollarSignGroup = new THREE.Group();
                
                // Vertical line of dollar sign
                const dollarLine = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 0.5, 0.03),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Green
                        metalness: 0.3,
                        roughness: 0.7
                    })
                );
                dollarSignGroup.add(dollarLine);
                
                // S curve of dollar sign (simplified with two curved lines)
                const curve1 = new THREE.Mesh(
                    new THREE.TorusGeometry(0.12, 0.04, 16, 16, Math.PI),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Green
                        metalness: 0.3,
                        roughness: 0.7
                    })
                );
                curve1.position.y = 0.12;
                curve1.rotation.z = Math.PI / 2;
                dollarSignGroup.add(curve1);
                
                const curve2 = new THREE.Mesh(
                    new THREE.TorusGeometry(0.12, 0.04, 16, 16, Math.PI),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Green
                        metalness: 0.3,
                        roughness: 0.7
                    })
                );
                curve2.position.y = -0.12;
                curve2.rotation.z = -Math.PI / 2;
                dollarSignGroup.add(curve2);
                
                dollarSignGroup.position.z = 0.06;
                loanGroup.add(dollarSignGroup);
                
                // Add coins stacked beside the bill
                const coinStack = new THREE.Group();
                coinStack.position.set(1.5, 0, 0.3);
                
                // Create several coins stacked on top of each other
                const coinColors = [0xFCD34D, 0xD1D5DB, 0xFCD34D]; // Gold, silver, gold
                for (let i = 0; i < 3; i++) {
                    const coin = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.4, 0.4, 0.07, 32),
                        new THREE.MeshStandardMaterial({ 
                            color: coinColors[i],
                            metalness: 0.7,
                            roughness: 0.3
                        })
                    );
                    coin.position.y = i * 0.08;
                    coin.rotation.x = Math.PI / 2;
                    coinStack.add(coin);
                    
                    // Add coin detail (circle on top)
                    const coinDetail = new THREE.Mesh(
                        new THREE.CircleGeometry(0.25, 32),
                        new THREE.MeshStandardMaterial({ 
                            color: coinColors[i] === 0xFCD34D ? 0xF59E0B : 0xA1A1AA,
                            metalness: 0.5,
                            roughness: 0.5
                        })
                    );
                    coinDetail.position.y = i * 0.08 + 0.04;
                    coinDetail.rotation.x = -Math.PI / 2;
                    coinStack.add(coinDetail);
                }
                
                loanGroup.add(coinStack);
                
                // Add a small house to represent mortgage/loans
                const house = new THREE.Group();
                house.position.set(-1.2, 0, 0.3);
                
                // House base
                const houseBase = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 0.5, 0.5),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x3B82F6, // Blue
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                house.add(houseBase);
                
                // House roof
                const roofGeometry = new THREE.ConeGeometry(0.6, 0.4, 4);
                const roof = new THREE.Mesh(
                    roofGeometry,
                    new THREE.MeshStandardMaterial({ 
                        color: 0x8B5CF6, // Purple
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                roof.position.y = 0.45;
                roof.rotation.y = Math.PI / 4;
                house.add(roof);
                
                // House door
                const door = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.3, 0.05),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xF59E0B, // Amber
                        metalness: 0.3,
                        roughness: 0.7
                    })
                );
                door.position.set(0, -0.1, 0.28);
                house.add(door);
                
                // House window
                const window = new THREE.Mesh(
                    new THREE.BoxGeometry(0.15, 0.15, 0.05),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xF3F4F6, // Light gray
                        metalness: 0.4,
                        roughness: 0.6,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                window.position.set(0, 0.15, 0.28);
                house.add(window);
                
                loanGroup.add(house);
                
                mesh = loanGroup;
                break;
                
            case 'gst-calculator':
                // Create a tax/receipt icon for GST calculator
                const gstGroup = new THREE.Group();
                
                // Receipt paper
                const receipt = new THREE.Mesh(
                    new THREE.BoxGeometry(1.8, 2.2, 0.05),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF, // White
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                gstGroup.add(receipt);
                
                // Receipt header
                const gstHeader = new THREE.Mesh(
                    new THREE.BoxGeometry(1.6, 0.3, 0.06),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x3B82F6, // Primary blue
                        metalness: 0.3,
                        roughness: 0.7
                    })
                );
                gstHeader.position.y = 0.9;
                gstHeader.position.z = 0.03;
                gstGroup.add(gstHeader);
                
                // Receipt lines (items)
                for (let i = 0; i < 5; i++) {
                    const itemLine = new THREE.Mesh(
                        new THREE.BoxGeometry(1.4, 0.08, 0.06),
                        new THREE.MeshStandardMaterial({ 
                            color: 0xE5E7EB, // Light gray
                            metalness: 0.1,
                            roughness: 0.9
                        })
                    );
                    itemLine.position.y = 0.5 - (i * 0.25);
                    itemLine.position.z = 0.03;
                    gstGroup.add(itemLine);
                }
                
                // GST line (highlighted)
                const gstLine = new THREE.Mesh(
                    new THREE.BoxGeometry(1.4, 0.12, 0.07),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Secondary green
                        metalness: 0.3,
                        roughness: 0.7,
                        emissive: 0x10B981,
                        emissiveIntensity: 0.2
                    })
                );
                gstLine.position.y = -0.8;
                gstLine.position.z = 0.04;
                gstGroup.add(gstLine);
                
                // Total line
                const totalLine = new THREE.Mesh(
                    new THREE.BoxGeometry(1.4, 0.15, 0.07),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x8B5CF6, // Accent purple
                        metalness: 0.3,
                        roughness: 0.7,
                        emissive: 0x8B5CF6,
                        emissiveIntensity: 0.2
                    })
                );
                totalLine.position.y = -1.0;
                totalLine.position.z = 0.04;
                gstGroup.add(totalLine);
                
                // Percentage symbol
                const gstPercentGroup = new THREE.Group();
                
                // Create % symbol with basic shapes
                // First circle
                const gstCircle1 = new THREE.Mesh(
                    new THREE.CircleGeometry(0.15, 16),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x3B82F6, // Primary blue
                        metalness: 0.4,
                        roughness: 0.6,
                        emissive: 0x3B82F6,
                        emissiveIntensity: 0.3
                    })
                );
                gstCircle1.position.set(-0.2, 0.2, 0.1);
                gstPercentGroup.add(gstCircle1);
                
                // Second circle
                const gstCircle2 = new THREE.Mesh(
                    new THREE.CircleGeometry(0.15, 16),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x3B82F6, // Primary blue
                        metalness: 0.4,
                        roughness: 0.6,
                        emissive: 0x3B82F6,
                        emissiveIntensity: 0.3
                    })
                );
                gstCircle2.position.set(0.2, -0.2, 0.1);
                gstPercentGroup.add(gstCircle2);
                
                // Diagonal line
                const gstLine2 = new THREE.Mesh(
                    new THREE.BoxGeometry(0.6, 0.08, 0.05),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x3B82F6, // Primary blue
                        metalness: 0.4,
                        roughness: 0.6,
                        emissive: 0x3B82F6,
                        emissiveIntensity: 0.3
                    })
                );
                gstLine2.position.z = 0.1;
                gstLine2.rotation.z = Math.PI / 4; // 45 degrees
                gstPercentGroup.add(gstLine2);
                
                // Position the percent symbol on the receipt
                gstPercentGroup.position.set(0.6, 0.6, 0.05);
                gstPercentGroup.scale.set(0.7, 0.7, 0.7);
                gstGroup.add(gstPercentGroup);
                
                mesh = gstGroup;
                break;
            case 'todo-list':
                // Create a clipboard with tasks
                const todoGroup = new THREE.Group();
                
                // Clipboard base
                const clipboard = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 2.5, 0.1),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xF3F4F6, // Light gray
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                todoGroup.add(clipboard);
                
                // Clipboard clip
                const clip = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.2, 0.2),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.primary,
                        metalness: 0.8,
                        roughness: 0.2
                    })
                );
                clip.position.y = 1.25;
                todoGroup.add(clip);
                
                // Task lines
                for (let i = 0; i < 4; i++) {
                    const taskLine = new THREE.Mesh(
                        new THREE.BoxGeometry(1.5, 0.08, 0.05),
                        new THREE.MeshStandardMaterial({ 
                            color: 0x6B7280, // Gray
                            metalness: 0.1,
                            roughness: 0.9
                        })
                    );
                    taskLine.position.y = 0.8 - (i * 0.4);
                    todoGroup.add(taskLine);
                    
                    // Checkboxes
                    const checkbox = new THREE.Mesh(
                        new THREE.BoxGeometry(0.2, 0.2, 0.05),
                        new THREE.MeshStandardMaterial({ 
                            color: i < 2 ? colors.accent : 0xD1D5DB, // First two checked
                            metalness: 0.1,
                            roughness: 0.9
                        })
                    );
                    checkbox.position.set(-0.8, 0.8 - (i * 0.4), 0.05);
                    todoGroup.add(checkbox);
                }
                
                mesh = todoGroup;
                break;
                
            case 'daily-planner':
                // Create a calendar/planner
                const plannerGroup = new THREE.Group();
                
                // Calendar base
                const calendar = new THREE.Mesh(
                    new THREE.BoxGeometry(2.2, 2.2, 0.1),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF,
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                plannerGroup.add(calendar);
                
                // Calendar header
                const plannerHeader = new THREE.Mesh(
                    new THREE.BoxGeometry(2.2, 0.4, 0.12),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.primary,
                        metalness: 0.3,
                        roughness: 0.7,
                        emissive: colors.primary,
                        emissiveIntensity: 0.2
                    })
                );
                plannerHeader.position.y = 0.9;
                plannerHeader.position.z = 0.01;
                plannerGroup.add(plannerHeader);
                
                // Calendar grid
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const cell = new THREE.Mesh(
                            new THREE.BoxGeometry(0.6, 0.5, 0.05),
                            new THREE.MeshStandardMaterial({ 
                                color: 0xF3F4F6,
                                metalness: 0.1,
                                roughness: 0.8
                            })
                        );
                        cell.position.set(-0.7 + (j * 0.7), 0.4 - (i * 0.6), 0.05);
                        plannerGroup.add(cell);
                        
                        // Add date numbers to some cells
                        if ((i * 3 + j) % 2 === 0) {
                            const dateHighlight = new THREE.Mesh(
                                new THREE.CircleGeometry(0.15, 16),
                                new THREE.MeshStandardMaterial({ 
                                    color: colors.secondary,
                                    metalness: 0.3,
                                    roughness: 0.7,
                                    emissive: colors.secondary,
                                    emissiveIntensity: 0.3
                                })
                            );
                            dateHighlight.position.set(-0.7 + (j * 0.7), 0.4 - (i * 0.6), 0.11);
                            plannerGroup.add(dateHighlight);
                        }
                    }
                }
                
                mesh = plannerGroup;
                break;
                
            case 'note':
                // Create a notebook with pages
                const noteGroup = new THREE.Group();
                
                // Notebook base
                const notebook = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 2.5, 0.2),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x3B82F6, // Primary blue
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                noteGroup.add(notebook);
                
                // Notebook pages
                const pages = new THREE.Mesh(
                    new THREE.BoxGeometry(1.9, 2.4, 0.1),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF, // White
                        metalness: 0.1,
                        roughness: 0.9
                    })
                );
                pages.position.z = 0.06;
                noteGroup.add(pages);
                
                // Notebook lines
                for (let i = 0; i < 6; i++) {
                    const line = new THREE.Mesh(
                        new THREE.BoxGeometry(1.6, 0.03, 0.02),
                        new THREE.MeshStandardMaterial({ 
                            color: 0xA1A1AA, // Gray
                            metalness: 0.1,
                            roughness: 0.9
                        })
                    );
                    line.position.set(0, 0.8 - (i * 0.3), 0.12);
                    noteGroup.add(line);
                }
                
                // Notebook binding (spiral)
                for (let i = 0; i < 10; i++) {
                    const spiral = new THREE.Mesh(
                        new THREE.TorusGeometry(0.08, 0.02, 8, 16),
                        new THREE.MeshStandardMaterial({ 
                            color: 0xF59E0B, // Amber
                            metalness: 0.7,
                            roughness: 0.3
                        })
                    );
                    spiral.position.set(-0.9, 1 - (i * 0.22), 0.1);
                    spiral.rotation.y = Math.PI / 2;
                    noteGroup.add(spiral);
                }
                
                // Pencil
                const pencilGroup = new THREE.Group();
                
                // Pencil body
                const pencilBody = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.06, 0.06, 1.5, 8),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFCD34D, // Yellow
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                pencilBody.rotation.z = Math.PI / 4;
                pencilGroup.add(pencilBody);
                
                // Pencil tip
                const pencilTip = new THREE.Mesh(
                    new THREE.ConeGeometry(0.06, 0.2, 8),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x4B5563, // Dark gray
                        metalness: 0.4,
                        roughness: 0.6
                    })
                );
                pencilTip.position.y = -0.85;
                pencilTip.rotation.z = Math.PI / 4;
                pencilGroup.add(pencilTip);
                
                // Position pencil on notebook
                pencilGroup.position.set(0.6, -0.4, 0.2);
                noteGroup.add(pencilGroup);
                
                mesh = noteGroup;
                break;
                
            case 'digital-clock':
                // Create a digital clock
                const clockGroup = new THREE.Group();
                
                // Clock base/frame
                const clockBase = new THREE.Mesh(
                    new THREE.BoxGeometry(2.2, 1.2, 0.3),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x1E3A8A, // Dark blue
                        metalness: 0.5,
                        roughness: 0.5
                    })
                );
                clockGroup.add(clockBase);
                
                // Clock screen
                const clockScreen = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 0.9, 0.1),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x000000, // Black
                        metalness: 0.2,
                        roughness: 0.8,
                        emissive: 0x111111,
                        emissiveIntensity: 0.5
                    })
                );
                clockScreen.position.z = 0.15;
                clockGroup.add(clockScreen);
                
                // Digital time display (digits)
                const digitMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x3B82F6, // Blue
                    emissive: 0x3B82F6,
                    emissiveIntensity: 0.8,
                    metalness: 0.2,
                    roughness: 0.8
                });
                
                // Create time segments (simulating 12:34)
                const createDigit = (x, value) => {
                    const digitGroup = new THREE.Group();
                    digitGroup.position.x = x;
                    
                    // Simple rectangular segments to form digital number
                    const segments = [];
                    
                    // Horizontal segments (top, middle, bottom)
                    const hSegGeom = new THREE.BoxGeometry(0.3, 0.05, 0.02);
                    const topSeg = new THREE.Mesh(hSegGeom, digitMaterial);
                    topSeg.position.y = 0.25;
                    segments.push(topSeg);
                    
                    const midSeg = new THREE.Mesh(hSegGeom, digitMaterial);
                    midSeg.position.y = 0;
                    segments.push(midSeg);
                    
                    const botSeg = new THREE.Mesh(hSegGeom, digitMaterial);
                    botSeg.position.y = -0.25;
                    segments.push(botSeg);
                    
                    // Vertical segments (top-left, top-right, bottom-left, bottom-right)
                    const vSegGeom = new THREE.BoxGeometry(0.05, 0.25, 0.02);
                    const topLeftSeg = new THREE.Mesh(vSegGeom, digitMaterial);
                    topLeftSeg.position.set(-0.15, 0.125, 0);
                    segments.push(topLeftSeg);
                    
                    const topRightSeg = new THREE.Mesh(vSegGeom, digitMaterial);
                    topRightSeg.position.set(0.15, 0.125, 0);
                    segments.push(topRightSeg);
                    
                    const botLeftSeg = new THREE.Mesh(vSegGeom, digitMaterial);
                    botLeftSeg.position.set(-0.15, -0.125, 0);
                    segments.push(botLeftSeg);
                    
                    const botRightSeg = new THREE.Mesh(vSegGeom, digitMaterial);
                    botRightSeg.position.set(0.15, -0.125, 0);
                    segments.push(botRightSeg);
                    
                    // Add all segments to the digit group
                    segments.forEach(seg => digitGroup.add(seg));
                    
                    return digitGroup;
                };
                
                // Create clock digits
                const digit1 = createDigit(-0.75, 1);
                const digit2 = createDigit(-0.25, 2);
                const digit3 = createDigit(0.25, 3);
                const digit4 = createDigit(0.75, 4);
                
                // Create colon between hours and minutes
                const colonGroup = new THREE.Group();
                const colonTop = new THREE.Mesh(
                    new THREE.BoxGeometry(0.05, 0.05, 0.02),
                    digitMaterial
                );
                colonTop.position.y = 0.1;
                colonGroup.add(colonTop);
                
                const colonBottom = new THREE.Mesh(
                    new THREE.BoxGeometry(0.05, 0.05, 0.02),
                    digitMaterial
                );
                colonBottom.position.y = -0.1;
                colonGroup.add(colonBottom);
                
                // Add all elements to the clock screen
                digit1.position.z = 0.2;
                digit2.position.z = 0.2;
                digit3.position.z = 0.2;
                digit4.position.z = 0.2;
                colonGroup.position.z = 0.2;
                
                clockGroup.add(digit1);
                clockGroup.add(digit2);
                clockGroup.add(colonGroup);
                clockGroup.add(digit3);
                clockGroup.add(digit4);
                
                // Add buttons on top of the clock
                for (let i = 0; i < 3; i++) {
                    const button = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16),
                        new THREE.MeshStandardMaterial({ 
                            color: 0x64748B, // Slate
                            metalness: 0.7,
                            roughness: 0.3
                        })
                    );
                    button.rotation.x = Math.PI / 2;
                    button.position.set(-0.6 + (i * 0.6), -0.7, 0.15);
                    clockGroup.add(button);
                }
                
                mesh = clockGroup;
                break;
                
            case 'percentage-calculator':
                // Create a percentage symbol with circular progress
                const percentCalcGroup = new THREE.Group();
                
                // Percentage circle (outer ring)
                const percentRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.8, 0.1, 16, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.primary,
                        metalness: 0.3,
                        roughness: 0.7
                    })
                );
                percentCalcGroup.add(percentRing);
                
                // Progress indicator (partial fill)
                const progressGeometry = new THREE.RingGeometry(0.7, 0.9, 32, 8, 0, Math.PI * 1.6);
                const progressMaterial = new THREE.MeshStandardMaterial({ 
                    color: colors.secondary,
                    metalness: 0.4,
                    roughness: 0.6,
                    side: THREE.DoubleSide
                });
                const progressRing = new THREE.Mesh(progressGeometry, progressMaterial);
                progressRing.rotation.z = Math.PI / 4;
                percentCalcGroup.add(progressRing);
                
                // Percentage symbol
                const symbolGroup = new THREE.Group();
                
                // Create % symbol with basic shapes
                // First circle
                const percentCircle1 = new THREE.Mesh(
                    new THREE.CircleGeometry(0.2, 16),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF,
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                percentCircle1.position.set(-0.25, 0.25, 0.1);
                symbolGroup.add(percentCircle1);
                
                // Second circle
                const percentCircle2 = new THREE.Mesh(
                    new THREE.CircleGeometry(0.2, 16),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF,
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                percentCircle2.position.set(0.25, -0.25, 0.1);
                symbolGroup.add(percentCircle2);
                
                // Diagonal line
                const percentLine = new THREE.Mesh(
                    new THREE.BoxGeometry(0.9, 0.08, 0.05),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF,
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                percentLine.rotation.z = Math.PI / 4;
                percentLine.position.z = 0.1;
                symbolGroup.add(percentLine);
                
                percentCalcGroup.add(symbolGroup);
                
                mesh = percentCalcGroup;
                break;
                
            case 'area-calculator':
                // Create an area calculator icon with geometric shapes
                const areaGroup = new THREE.Group();
                
                // Base platform
                const basePlatform = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 0.1, 2),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.primary,
                        metalness: 0.3,
                        roughness: 0.7
                    })
                );
                basePlatform.position.y = -0.5;
                areaGroup.add(basePlatform);
                
                // Create various geometric shapes to represent area calculation
                
                // Square shape
                const square = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 0.05, 0.8),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.secondary,
                        metalness: 0.4,
                        roughness: 0.6,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                square.position.set(-0.5, -0.4, -0.5);
                areaGroup.add(square);
                
                // Circle shape
                const circle = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.accent,
                        metalness: 0.4,
                        roughness: 0.6,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                circle.position.set(0.5, -0.4, 0.5);
                areaGroup.add(circle);
                
                // Triangle shape
                const triangleGeometry = new THREE.BufferGeometry();
                const vertices = new Float32Array([
                    0, 0, 0,
                    0.8, 0, 0,
                    0.4, 0, 0.7
                ]);
                triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                triangleGeometry.computeVertexNormals();
                
                const triangle = new THREE.Mesh(
                    triangleGeometry,
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Green
                        metalness: 0.4,
                        roughness: 0.6,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                triangle.position.set(-0.4, -0.4, 0.4);
                triangle.rotation.x = -Math.PI / 2;
                areaGroup.add(triangle);
                
                // Ruler/measuring tool
                const ruler = new THREE.Mesh(
                    new THREE.BoxGeometry(1.8, 0.08, 0.2),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF,
                        metalness: 0.2,
                        roughness: 0.8
                    })
                );
                ruler.position.set(0, 0.3, 0);
                areaGroup.add(ruler);
                
                // Ruler markings
                for (let i = 0; i < 9; i++) {
                    const marking = new THREE.Mesh(
                        new THREE.BoxGeometry(0.02, 0.15, 0.05),
                        new THREE.MeshStandardMaterial({ 
                            color: 0x000000,
                            metalness: 0.2,
                            roughness: 0.8
                        })
                    );
                    marking.position.set(-0.8 + (i * 0.2), 0.35, 0);
                    areaGroup.add(marking);
                }
                
                // Grid lines on base to represent measurement
                for (let i = 0; i < 5; i++) {
                    // Horizontal grid lines
                    const hLine = new THREE.Mesh(
                        new THREE.BoxGeometry(1.8, 0.01, 0.01),
                        new THREE.MeshStandardMaterial({ 
                            color: 0xFFFFFF,
                            metalness: 0.1,
                            roughness: 0.9
                        })
                    );
                    hLine.position.set(0, -0.45, -0.9 + (i * 0.45));
                    areaGroup.add(hLine);
                    
                    // Vertical grid lines
                    const vLine = new THREE.Mesh(
                        new THREE.BoxGeometry(0.01, 0.01, 1.8),
                        new THREE.MeshStandardMaterial({ 
                            color: 0xFFFFFF,
                            metalness: 0.1,
                            roughness: 0.9
                        })
                    );
                    vLine.position.set(-0.9 + (i * 0.45), -0.45, 0);
                    areaGroup.add(vLine);
                }
                
                mesh = areaGroup;
                break;
                
            // Add more tool types here as needed
                
            default:
                // Generic tool icon (gear/cog)
                const gearGroup = new THREE.Group();
                
                // Main gear
                const mainGear = new THREE.Mesh(
                    new THREE.TorusGeometry(1, 0.3, 16, 8),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.primary,
                        metalness: 0.6,
                        roughness: 0.4,
                        emissive: colors.primary,
                        emissiveIntensity: 0.2
                    })
                );
                gearGroup.add(mainGear);
                
                // Gear teeth
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const tooth = new THREE.Mesh(
                        new THREE.BoxGeometry(0.4, 0.4, 0.4),
                        new THREE.MeshStandardMaterial({ 
                            color: colors.secondary,
                            metalness: 0.7,
                            roughness: 0.3
                        })
                    );
                    tooth.position.x = Math.cos(angle) * 1.3;
                    tooth.position.y = Math.sin(angle) * 1.3;
                    tooth.rotation.z = angle;
                    gearGroup.add(tooth);
                }
                
                // Center piece
                const centerPiece = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16),
                    new THREE.MeshStandardMaterial({ 
                        color: colors.accent,
                        metalness: 0.8,
                        roughness: 0.2,
                        emissive: colors.accent,
                        emissiveIntensity: 0.3
                    })
                );
                centerPiece.rotation.x = Math.PI / 2;
                gearGroup.add(centerPiece);
                
                mesh = gearGroup;
        }
        
        scene.add(mesh);
    },
    
    // Create Prime Number Icon
    createPrimeNumberIcon: function(scene, colors) {
        const primeGroup = new THREE.Group();
        
        // Create a number 7 (a prime number) as the main icon
        const numberMaterial = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            metalness: 0.3,
            roughness: 0.7
        });
        
        // Create the vertical line of the 7
        const verticalLine = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 1.2, 0.2),
            numberMaterial
        );
        verticalLine.position.set(0.4, 0, 0);
        primeGroup.add(verticalLine);
        
        // Create the horizontal line of the 7
        const horizontalLine = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 0.2),
            numberMaterial
        );
        horizontalLine.position.set(0, 0.5, 0);
        primeGroup.add(horizontalLine);
        
        // Create a circle to represent the "prime" concept
        const circle = new THREE.Mesh(
            new THREE.TorusGeometry(0.8, 0.08, 16, 50),
            new THREE.MeshStandardMaterial({
                color: colors.primary,
                metalness: 0.4,
                roughness: 0.6
            })
        );
        circle.rotation.x = Math.PI / 2;
        circle.position.z = -0.2;
        primeGroup.add(circle);
        
        // Add small spheres to represent prime factors
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.5,
            roughness: 0.5
        });
        
        // Add 3 small spheres (representing prime factors)
        const sphere1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            sphereMaterial
        );
        sphere1.position.set(-0.6, -0.4, 0.2);
        primeGroup.add(sphere1);
        
        const sphere2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            sphereMaterial
        );
        sphere2.position.set(0.6, -0.4, 0.2);
        primeGroup.add(sphere2);
        
        const sphere3 = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            sphereMaterial
        );
        sphere3.position.set(0, -0.4, 0.4);
        primeGroup.add(sphere3);
        
        // Scale and position the group
        primeGroup.scale.set(0.8, 0.8, 0.8);
        scene.add(primeGroup);
        
        return primeGroup;
    },
    
    // Animation loop
    animate: function() {
        animationFrameId = requestAnimationFrame(this.animate.bind(this));
        
        if (mesh) {
            // Add subtle floating animation
            const time = Date.now() * 0.001;
            mesh.position.y = Math.sin(time) * 0.1;
            
            // Add subtle rotation
            if (mesh.userData && mesh.userData.autoRotate !== false) {
                mesh.rotation.y += 0.005;
            }
        }
        
        renderer.render(scene, camera);
    },
    
    // Create flashcards 3D icon
    createFlashcardsIcon: function() {
        // Create a group to hold all card elements
        const group = new THREE.Group();
        
        // Create multiple cards with slight offsets
        const cardCount = 3;
        const cardWidth = 2;
        const cardHeight = 1.4;
        const cardDepth = 0.05;
        const cardSpacing = 0.1;
        
        // Colors for the cards
        const cardColors = [
            new THREE.Color(colors.primary),
            new THREE.Color(colors.secondary),
            new THREE.Color(colors.accent)
        ];
        
        // Create each card
        for (let i = 0; i < cardCount; i++) {
            // Card geometry
            const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
            
            // Card materials - different color for each card
            const cardMaterials = [
                new THREE.MeshPhongMaterial({ color: 0xffffff }), // right side
                new THREE.MeshPhongMaterial({ color: 0xffffff }), // left side
                new THREE.MeshPhongMaterial({ color: 0xffffff }), // top side
                new THREE.MeshPhongMaterial({ color: 0xffffff }), // bottom side
                new THREE.MeshPhongMaterial({ color: cardColors[i] }), // front side
                new THREE.MeshPhongMaterial({ color: 0xffffff }) // back side
            ];
            
            // Create card mesh
            const card = new THREE.Mesh(cardGeometry, cardMaterials);
            
            // Position with slight offset for stacked appearance
            card.position.z = i * (cardDepth + cardSpacing);
            card.position.x = -i * 0.1; // Slight horizontal offset
            card.position.y = i * 0.05; // Slight vertical offset
            
            // Add slight random rotation for natural look
            card.rotation.z = (Math.random() - 0.5) * 0.1;
            
            // Add text to the front of the card
            if (i === cardCount - 1) { // Only add text to the top card
                // Create a canvas for the text
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 256;
                
                // Draw background
                context.fillStyle = colors.primary;
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw text
                context.font = 'bold 40px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText('A', canvas.width / 2, canvas.height / 2);
                
                // Create texture from canvas
                const texture = new THREE.CanvasTexture(canvas);
                
                // Apply texture to front face
                cardMaterials[4] = new THREE.MeshBasicMaterial({ map: texture });
            }
            
            // Add card to group
            group.add(card);
        }
        
        // Center the group
        group.position.z = -cardCount * (cardDepth + cardSpacing) / 2;
        
        // Add group to scene
        scene.add(group);
        
        // Store reference for animation
        mesh = group;
        
        // Add initial animation
        gsap.from(group.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)"
        });
    },
    
    // Clean up resources
    dispose: function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        if (renderer) {
            renderer.dispose();
        }
        
        // Clean up geometries and materials
        if (scene) {
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
    }
};

// Public API
const Tool3DIconAPI = {
    init: Tool3DIcon.init,
    dispose: Tool3DIcon.dispose
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find all tool 3D containers
    const containers = document.querySelectorAll('.tool-3d-container');
    
    containers.forEach(container => {
        // Get the tool type from data attribute or from the page URL
        let toolType = container.dataset.toolType;
        
        // If no tool type is specified, try to determine it from the URL
        if (!toolType) {
            const path = window.location.pathname;
            const filename = path.substring(path.lastIndexOf('/') + 1);
            toolType = filename.replace('.html', '');
        }
        
        // Initialize the 3D icon
        Tool3DIcon.init(container, toolType);
    });
});

// Update footer with current year
document.addEventListener('DOMContentLoaded', function() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
});