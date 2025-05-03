/**
 * Periodic Table - JavaScript functionality
 * Interactive periodic table with element details and filtering capabilities
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const periodicTable = document.getElementById('periodic-table');
    const elementSearch = document.getElementById('element-search');
    const categoryFilter = document.getElementById('category-filter');
    const resetFilters = document.getElementById('reset-filters');
    const elementDetails = document.getElementById('element-details');
    const closeDetails = document.getElementById('close-details');
    
    // Element detail fields
    const elementName = document.getElementById('element-name');
    const elementCategory = document.getElementById('element-category');
    const elementSymbol = document.getElementById('element-symbol');
    const elementAtomicNumber = document.getElementById('element-atomic-number');
    const elementAtomicMass = document.getElementById('element-atomic-mass');
    const elementElectronConfig = document.getElementById('element-electron-config');
    const elementState = document.getElementById('element-state');
    const elementMeltingPoint = document.getElementById('element-melting-point');
    const elementBoilingPoint = document.getElementById('element-boiling-point');
    const elementDensity = document.getElementById('element-density');
    const elementDescription = document.getElementById('element-description');
    
    // Initialize the Periodic Table
    function initPeriodicTable() {
        // Set up event listeners
        setupEventListeners();
        
        // Generate the periodic table
        generatePeriodicTable();
        
        // Set current year in footer
        if (document.querySelector('.current-year')) {
            document.querySelector('.current-year').textContent = new Date().getFullYear();
        }
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'periodic-table');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Search input
        elementSearch.addEventListener('input', filterElements);
        
        // Category filter
        categoryFilter.addEventListener('change', filterElements);
        
        // Reset filters
        resetFilters.addEventListener('click', function() {
            elementSearch.value = '';
            categoryFilter.value = 'all';
            filterElements();
        });
        
        // Close element details
        closeDetails.addEventListener('click', function() {
            elementDetails.classList.add('hidden');
        });
    }
    
    // Generate the periodic table
    function generatePeriodicTable() {
        // Clear the container
        periodicTable.innerHTML = '';
        
        // Create the table grid
        const tableGrid = document.createElement('div');
        tableGrid.className = 'grid grid-cols-18 gap-1 min-w-[1000px] w-full';
        periodicTable.appendChild(tableGrid);
        
        // Add empty cells for the layout
        for (let i = 0; i < 18 * 10; i++) {
            const cell = document.createElement('div');
            cell.className = 'w-14 h-14 relative';
            
            // Skip cells that don't contain elements
            if (shouldSkipCell(i)) {
                tableGrid.appendChild(cell);
                continue;
            }
            
            // Get element data for this position
            const element = getElementForPosition(i);
            if (element) {
                // Create element cell
                const elementCell = createElementCell(element);
                tableGrid.appendChild(elementCell);
            } else {
                tableGrid.appendChild(cell);
            }
        }
        
        // Add lanthanides and actinides in separate rows
        addLanthanideActinideSeries(tableGrid);
    }
    
    // Determine if a cell should be skipped (empty in the periodic table layout)
    function shouldSkipCell(index) {
        const row = Math.floor(index / 18);
        const col = index % 18;
        
        // First row has only H and He
        if (row === 0 && col > 0 && col < 17) return true;
        
        // Second and third rows have elements only in specific columns
        if ((row === 1 || row === 2) && col > 1 && col < 12) return true;
        
        return false;
    }
    
    // Get element data for a specific position in the grid
    function getElementForPosition(index) {
        const row = Math.floor(index / 18);
        const col = index % 18;
        
        // Map grid positions to elements
        // This is a simplified mapping - a full implementation would have a complete dataset
        
        // First row: H and He
        if (row === 0) {
            if (col === 0) return elements[0]; // H
            if (col === 17) return elements[1]; // He
        }
        
        // Second row: Li to Ne
        if (row === 1) {
            if (col === 0) return elements[2]; // Li
            if (col === 1) return elements[3]; // Be
            if (col >= 12 && col <= 17) return elements[col - 8]; // B to Ne
        }
        
        // Third row: Na to Ar
        if (row === 2) {
            if (col === 0) return elements[10]; // Na
            if (col === 1) return elements[11]; // Mg
            if (col >= 12 && col <= 17) return elements[col - 0]; // Al to Ar
        }
        
        // Fourth row: K to Kr
        if (row === 3) {
            if (col >= 0 && col <= 17) {
                const elementIndex = 18 + col;
                return elements[elementIndex] || null;
            }
        }
        
        // Fifth row: Rb to Xe
        if (row === 4) {
            if (col >= 0 && col <= 17) {
                const elementIndex = 36 + col;
                return elements[elementIndex] || null;
            }
        }
        
        // Sixth row: Cs to Rn (excluding lanthanides)
        if (row === 5) {
            if (col === 0) return elements[54]; // Cs
            if (col === 1) return elements[55]; // Ba
            if (col === 2) return { symbol: 'La*', name: 'Lanthanides', category: 'lanthanides', number: '57-71' };
            if (col >= 3 && col <= 17) {
                const elementIndex = 71 + col - 2;
                return elements[elementIndex] || null;
            }
        }
        
        // Seventh row: Fr to Og (excluding actinides)
        if (row === 6) {
            if (col === 0) return elements[86]; // Fr
            if (col === 1) return elements[87]; // Ra
            if (col === 2) return { symbol: 'Ac*', name: 'Actinides', category: 'actinides', number: '89-103' };
            if (col >= 3 && col <= 17) {
                const elementIndex = 103 + col - 2;
                return elements[elementIndex] || null;
            }
        }
        
        return null;
    }
    
    // Create an element cell for the periodic table
    function createElementCell(element) {
        const cell = document.createElement('div');
        cell.className = `w-14 h-14 flex flex-col justify-center items-center text-center p-1 rounded cursor-pointer transition-transform hover:scale-105 hover:z-10 element-cell ${getCategoryClass(element.category)}`;
        cell.dataset.element = element.symbol;
        cell.dataset.category = element.category;
        
        // Add atomic number
        const number = document.createElement('div');
        number.className = 'text-xs leading-tight';
        number.textContent = element.number;
        cell.appendChild(number);
        
        // Add symbol
        const symbol = document.createElement('div');
        symbol.className = 'text-lg font-bold leading-tight';
        symbol.textContent = element.symbol;
        cell.appendChild(symbol);
        
        // Add name
        const name = document.createElement('div');
        name.className = 'text-[8px] leading-tight truncate w-full';
        name.textContent = element.name;
        cell.appendChild(name);
        
        // Add click event to show element details
        cell.addEventListener('click', function() {
            showElementDetails(element);
        });
        
        return cell;
    }
    
    // Add lanthanide and actinide series to the table
    function addLanthanideActinideSeries(tableGrid) {
        // Add spacer row
        const spacer = document.createElement('div');
        spacer.className = 'col-span-18 h-4';
        tableGrid.appendChild(spacer);
        
        // Add lanthanides row
        for (let i = 0; i < 15; i++) {
            if (i === 0) {
                // Add label cell
                const labelCell = document.createElement('div');
                labelCell.className = 'w-14 h-14 flex items-center justify-center text-sm font-medium';
                labelCell.textContent = 'Lanthanides';
                tableGrid.appendChild(labelCell);
                continue;
            }
            
            // Get lanthanide element (57-71)
            const element = elements[56 + i];
            if (element) {
                const elementCell = createElementCell(element);
                tableGrid.appendChild(elementCell);
            }
        }
        
        // Add empty cells to complete the row
        for (let i = 0; i < 3; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'w-14 h-14';
            tableGrid.appendChild(emptyCell);
        }
        
        // Add actinides row
        for (let i = 0; i < 15; i++) {
            if (i === 0) {
                // Add label cell
                const labelCell = document.createElement('div');
                labelCell.className = 'w-14 h-14 flex items-center justify-center text-sm font-medium';
                labelCell.textContent = 'Actinides';
                tableGrid.appendChild(labelCell);
                continue;
            }
            
            // Get actinide element (89-103)
            const element = elements[88 + i];
            if (element) {
                const elementCell = createElementCell(element);
                tableGrid.appendChild(elementCell);
            }
        }
        
        // Add empty cells to complete the row
        for (let i = 0; i < 3; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'w-14 h-14';
            tableGrid.appendChild(emptyCell);
        }
    }
    
    // Get CSS class for element category
    function getCategoryClass(category) {
        const categoryClasses = {
            'alkali-metals': 'bg-blue-500 text-white',
            'alkaline-earth-metals': 'bg-yellow-500 text-white',
            'transition-metals': 'bg-purple-500 text-white',
            'post-transition-metals': 'bg-gray-400 text-white',
            'metalloids': 'bg-green-300 text-gray-800',
            'nonmetals': 'bg-green-500 text-white',
            'halogens': 'bg-teal-500 text-white',
            'noble-gases': 'bg-red-500 text-white',
            'lanthanides': 'bg-orange-500 text-white',
            'actinides': 'bg-pink-500 text-white',
            'unknown': 'bg-gray-200 text-gray-800'
        };
        
        return categoryClasses[category] || 'bg-gray-200 text-gray-800';
    }
    
    // Filter elements based on search and category
    function filterElements() {
        const searchTerm = elementSearch.value.toLowerCase();
        const category = categoryFilter.value;
        
        // Get all element cells
        const elementCells = document.querySelectorAll('.element-cell');
        
        elementCells.forEach(cell => {
            const elementSymbol = cell.dataset.element.toLowerCase();
            const elementCategory = cell.dataset.category;
            const element = elements.find(e => e.symbol.toLowerCase() === elementSymbol);
            
            // Check if element matches search term
            const matchesSearch = searchTerm === '' || 
                                 elementSymbol.includes(searchTerm) || 
                                 (element && element.name.toLowerCase().includes(searchTerm)) ||
                                 (element && element.number.toString().includes(searchTerm));
            
            // Check if element matches category filter
            const matchesCategory = category === 'all' || elementCategory === category;
            
            // Show/hide element based on filters
            if (matchesSearch && matchesCategory) {
                cell.classList.remove('opacity-30');
            } else {
                cell.classList.add('opacity-30');
            }
        });
    }
    
    // Show element details
    function showElementDetails(element) {
        // Skip showing details for category placeholders
        if (element.symbol.includes('*')) return;
        
        // Set element details
        elementName.textContent = element.name;
        elementCategory.textContent = getCategoryName(element.category);
        elementSymbol.textContent = element.symbol;
        elementAtomicNumber.textContent = element.number;
        elementAtomicMass.textContent = element.atomic_mass || 'Unknown';
        elementElectronConfig.textContent = element.electron_configuration || 'Unknown';
        elementState.textContent = element.state || 'Unknown';
        elementMeltingPoint.textContent = element.melting_point || 'Unknown';
        elementBoilingPoint.textContent = element.boiling_point || 'Unknown';
        elementDensity.textContent = element.density || 'Unknown';
        elementDescription.textContent = element.description || 'No description available.';
        
        // Show the details panel
        elementDetails.classList.remove('hidden');
    }
    
    // Get human-readable category name
    function getCategoryName(category) {
        const categoryNames = {
            'alkali-metals': 'Alkali Metal',
            'alkaline-earth-metals': 'Alkaline Earth Metal',
            'transition-metals': 'Transition Metal',
            'post-transition-metals': 'Post-Transition Metal',
            'metalloids': 'Metalloid',
            'nonmetals': 'Nonmetal',
            'halogens': 'Halogen',
            'noble-gases': 'Noble Gas',
            'lanthanides': 'Lanthanide',
            'actinides': 'Actinide',
            'unknown': 'Unknown'
        };
        
        return categoryNames[category] || 'Unknown';
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
    
    // Complete element data for all 118 elements
    const elements = [
        // Period 1
        { symbol: 'H', name: 'Hydrogen', number: '1', category: 'nonmetals', atomic_mass: '1.008', electron_configuration: '1s¹', state: 'Gas', melting_point: '-259.16°C', boiling_point: '-252.87°C', density: '0.00008988 g/cm³', description: 'Hydrogen is the lightest element and the most abundant chemical substance in the universe, constituting roughly 75% of all normal matter.' },
        { symbol: 'He', name: 'Helium', number: '2', category: 'noble-gases', atomic_mass: '4.0026', electron_configuration: '1s²', state: 'Gas', melting_point: '-272.2°C (at pressure)', boiling_point: '-268.93°C', density: '0.0001785 g/cm³', description: 'Helium is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas group in the periodic table.' },
        
        // Period 2
        { symbol: 'Li', name: 'Lithium', number: '3', category: 'alkali-metals', atomic_mass: '6.94', electron_configuration: '[He] 2s¹', state: 'Solid', melting_point: '180.54°C', boiling_point: '1342°C', density: '0.534 g/cm³', description: 'Lithium is a soft, silvery-white alkali metal. Under standard conditions, it is the lightest metal and the lightest solid element.' },
        { symbol: 'Be', name: 'Beryllium', number: '4', category: 'alkaline-earth-metals', atomic_mass: '9.0122', electron_configuration: '[He] 2s²', state: 'Solid', melting_point: '1287°C', boiling_point: '2470°C', density: '1.85 g/cm³', description: 'Beryllium is a relatively rare element in the universe. It is a divalent element which occurs naturally only in combination with other elements to form minerals.' },
        { symbol: 'B', name: 'Boron', number: '5', category: 'metalloids', atomic_mass: '10.81', electron_configuration: '[He] 2s² 2p¹', state: 'Solid', melting_point: '2076°C', boiling_point: '3927°C', density: '2.34 g/cm³', description: 'Boron is a chemical element with properties between those of carbon and aluminum. It is a semiconductor rather than a metallic element.' },
        { symbol: 'C', name: 'Carbon', number: '6', category: 'nonmetals', atomic_mass: '12.011', electron_configuration: '[He] 2s² 2p²', state: 'Solid', melting_point: '3550°C', boiling_point: '4027°C', density: '2.267 g/cm³', description: 'Carbon is a nonmetallic chemical element that is the basis of organic compounds. It is essential to all known living systems.' },
        { symbol: 'N', name: 'Nitrogen', number: '7', category: 'nonmetals', atomic_mass: '14.007', electron_configuration: '[He] 2s² 2p³', state: 'Gas', melting_point: '-210.1°C', boiling_point: '-195.79°C', density: '0.001251 g/cm³', description: 'Nitrogen is a colorless, odorless, tasteless gas that makes up about 78% of Earth\'s atmosphere. It is a constituent element of all living tissues.' },
        { symbol: 'O', name: 'Oxygen', number: '8', category: 'nonmetals', atomic_mass: '15.999', electron_configuration: '[He] 2s² 2p⁴', state: 'Gas', melting_point: '-218.79°C', boiling_point: '-182.95°C', density: '0.001429 g/cm³', description: 'Oxygen is a highly reactive nonmetallic element that readily forms compounds with most elements. It is essential for respiration in all aerobic organisms.' },
        { symbol: 'F', name: 'Fluorine', number: '9', category: 'halogens', atomic_mass: '18.998', electron_configuration: '[He] 2s² 2p⁵', state: 'Gas', melting_point: '-219.67°C', boiling_point: '-188.11°C', density: '0.001696 g/cm³', description: 'Fluorine is the lightest halogen and the most electronegative element. It is extremely reactive and forms compounds with most other elements.' },
        { symbol: 'Ne', name: 'Neon', number: '10', category: 'noble-gases', atomic_mass: '20.180', electron_configuration: '[He] 2s² 2p⁶', state: 'Gas', melting_point: '-248.59°C', boiling_point: '-246.08°C', density: '0.0008999 g/cm³', description: 'Neon is a colorless, odorless, inert monatomic gas. It gives a distinct reddish-orange glow when used in low-voltage neon glow lamps and high-voltage discharge tubes.' },
        
        // Period 3
        { symbol: 'Na', name: 'Sodium', number: '11', category: 'alkali-metals', atomic_mass: '22.990', electron_configuration: '[Ne] 3s¹', state: 'Solid', melting_point: '97.72°C', boiling_point: '883°C', density: '0.968 g/cm³', description: 'Sodium is a soft, silvery-white, highly reactive metal. It is an abundant element that exists in numerous minerals.' },
        { symbol: 'Mg', name: 'Magnesium', number: '12', category: 'alkaline-earth-metals', atomic_mass: '24.305', electron_configuration: '[Ne] 3s²', state: 'Solid', melting_point: '650°C', boiling_point: '1090°C', density: '1.738 g/cm³', description: 'Magnesium is a shiny gray solid which bears a close physical resemblance to the other five elements in the second column of the periodic table.' },
        { symbol: 'Al', name: 'Aluminum', number: '13', category: 'post-transition-metals', atomic_mass: '26.982', electron_configuration: '[Ne] 3s² 3p¹', state: 'Solid', melting_point: '660.32°C', boiling_point: '2519°C', density: '2.70 g/cm³', description: 'Aluminum is a silvery-white, soft, non-magnetic metal. It is the third most abundant element in the Earth\'s crust after oxygen and silicon.' },
        { symbol: 'Si', name: 'Silicon', number: '14', category: 'metalloids', atomic_mass: '28.085', electron_configuration: '[Ne] 3s² 3p²', state: 'Solid', melting_point: '1414°C', boiling_point: '3265°C', density: '2.33 g/cm³', description: 'Silicon is a hard, brittle crystalline solid with a blue-grey metallic luster. It is a semiconductor and is essential for the electronics industry.' },
        { symbol: 'P', name: 'Phosphorus', number: '15', category: 'nonmetals', atomic_mass: '30.974', electron_configuration: '[Ne] 3s² 3p³', state: 'Solid', melting_point: '44.15°C', boiling_point: '280.5°C', density: '1.82 g/cm³', description: 'Phosphorus is a multivalent nonmetal that exists in several forms. It is essential for life, being a component of DNA, RNA, ATP, and phospholipids.' },
        { symbol: 'S', name: 'Sulfur', number: '16', category: 'nonmetals', atomic_mass: '32.06', electron_configuration: '[Ne] 3s² 3p⁴', state: 'Solid', melting_point: '115.21°C', boiling_point: '444.72°C', density: '2.07 g/cm³', description: 'Sulfur is a bright yellow crystalline solid at room temperature. It is an essential element for all life, and is widely used in biochemical processes.' },
        { symbol: 'Cl', name: 'Chlorine', number: '17', category: 'halogens', atomic_mass: '35.45', electron_configuration: '[Ne] 3s² 3p⁵', state: 'Gas', melting_point: '-101.5°C', boiling_point: '-34.04°C', density: '0.003214 g/cm³', description: 'Chlorine is a yellow-green gas at room temperature. It is a highly reactive element and a strong oxidizing agent used in many industrial processes.' },
        { symbol: 'Ar', name: 'Argon', number: '18', category: 'noble-gases', atomic_mass: '39.948', electron_configuration: '[Ne] 3s² 3p⁶', state: 'Gas', melting_point: '-189.34°C', boiling_point: '-185.85°C', density: '0.0017837 g/cm³', description: 'Argon is the third most abundant gas in the Earth\'s atmosphere. It is colorless, odorless, and extremely unreactive, making it useful in applications requiring an inert atmosphere.' },
        
        // Period 4
        { symbol: 'K', name: 'Potassium', number: '19', category: 'alkali-metals', atomic_mass: '39.098', electron_configuration: '[Ar] 4s¹', state: 'Solid', melting_point: '63.38°C', boiling_point: '759°C', density: '0.89 g/cm³', description: 'Potassium is a soft, silvery-white metal that oxidizes rapidly in air. It is essential for the function of all living cells and is the eighth most abundant element in the Earth\'s crust.' },
        { symbol: 'Ca', name: 'Calcium', number: '20', category: 'alkaline-earth-metals', atomic_mass: '40.078', electron_configuration: '[Ar] 4s²', state: 'Solid', melting_point: '842°C', boiling_point: '1484°C', density: '1.55 g/cm³', description: 'Calcium is a soft, silvery-white alkaline earth metal. It is essential for living organisms, particularly for the formation of bones and teeth.' },
        { symbol: 'Sc', name: 'Scandium', number: '21', category: 'transition-metals', atomic_mass: '44.956', electron_configuration: '[Ar] 3d¹ 4s²', state: 'Solid', melting_point: '1541°C', boiling_point: '2836°C', density: '2.99 g/cm³', description: 'Scandium is a silvery-white metallic element that develops a slightly yellowish or pinkish cast when exposed to air. It is relatively soft and has properties similar to aluminum and the rare earth elements.' },
        { symbol: 'Ti', name: 'Titanium', number: '22', category: 'transition-metals', atomic_mass: '47.867', electron_configuration: '[Ar] 3d² 4s²', state: 'Solid', melting_point: '1668°C', boiling_point: '3287°C', density: '4.5 g/cm³', description: 'Titanium is a lustrous transition metal with a silver color, low density, and high strength. It is highly resistant to corrosion in sea water, aqua regia, and chlorine.' },
        { symbol: 'V', name: 'Vanadium', number: '23', category: 'transition-metals', atomic_mass: '50.942', electron_configuration: '[Ar] 3d³ 4s²', state: 'Solid', melting_point: '1910°C', boiling_point: '3407°C', density: '6.0 g/cm³', description: 'Vanadium is a hard, silvery-grey, ductile, and malleable transition metal. It is primarily used as an alloying agent for iron and steel, particularly in high-speed tool steels.' },
        { symbol: 'Cr', name: 'Chromium', number: '24', category: 'transition-metals', atomic_mass: '51.996', electron_configuration: '[Ar] 3d⁵ 4s¹', state: 'Solid', melting_point: '1907°C', boiling_point: '2671°C', density: '7.19 g/cm³', description: 'Chromium is a steely-grey, lustrous, hard metal that takes a high polish and has a high melting point. It is also odorless, tasteless, and malleable.' },
        { symbol: 'Mn', name: 'Manganese', number: '25', category: 'transition-metals', atomic_mass: '54.938', electron_configuration: '[Ar] 3d⁵ 4s²', state: 'Solid', melting_point: '1246°C', boiling_point: '2061°C', density: '7.43 g/cm³', description: 'Manganese is a silvery-gray metal that resembles iron. It is hard and very brittle, difficult to fuse, but easy to oxidize.' },
        { symbol: 'Fe', name: 'Iron', number: '26', category: 'transition-metals', atomic_mass: '55.845', electron_configuration: '[Ar] 3d⁶ 4s²', state: 'Solid', melting_point: '1538°C', boiling_point: '2862°C', density: '7.87 g/cm³', description: 'Iron is a metal in the first transition series. It is the most common element on Earth (by mass) and forms much of Earth\'s outer and inner core. It is the fourth most common element in the Earth\'s crust.' },
        { symbol: 'Co', name: 'Cobalt', number: '27', category: 'transition-metals', atomic_mass: '58.933', electron_configuration: '[Ar] 3d⁷ 4s²', state: 'Solid', melting_point: '1495°C', boiling_point: '2927°C', density: '8.90 g/cm³', description: 'Cobalt is a hard, lustrous, silver-gray metal. It is found in the Earth\'s crust only in a chemically combined form and is essential to many living organisms as a component of vitamin B12.' },
        { symbol: 'Ni', name: 'Nickel', number: '28', category: 'transition-metals', atomic_mass: '58.693', electron_configuration: '[Ar] 3d⁸ 4s²', state: 'Solid', melting_point: '1455°C', boiling_point: '2913°C', density: '8.91 g/cm³', description: 'Nickel is a silvery-white lustrous metal with a slight golden tinge. It is one of the four ferromagnetic elements at room temperature, the other three being iron, cobalt, and gadolinium.' },
        { symbol: 'Cu', name: 'Copper', number: '29', category: 'transition-metals', atomic_mass: '63.546', electron_configuration: '[Ar] 3d¹⁰ 4s¹', state: 'Solid', melting_point: '1084.62°C', boiling_point: '2562°C', density: '8.96 g/cm³', description: 'Copper is a soft, malleable, and ductile metal with very high thermal and electrical conductivity. It is used as a conductor of heat and electricity, as a building material, and as a constituent of various metal alloys.' },
        { symbol: 'Zn', name: 'Zinc', number: '30', category: 'transition-metals', atomic_mass: '65.38', electron_configuration: '[Ar] 3d¹⁰ 4s²', state: 'Solid', melting_point: '419.53°C', boiling_point: '907°C', density: '7.14 g/cm³', description: 'Zinc is a slightly brittle metal at room temperature and has a blue-silvery appearance when oxidation is removed. It is the 24th most abundant element in Earth\'s crust.' },
        { symbol: 'Ga', name: 'Gallium', number: '31', category: 'post-transition-metals', atomic_mass: '69.723', electron_configuration: '[Ar] 3d¹⁰ 4s² 4p¹', state: 'Solid', melting_point: '29.76°C', boiling_point: '2204°C', density: '5.91 g/cm³', description: 'Gallium is a soft, silvery metal that becomes liquid at temperatures greater than 29.76°C. It is notable for its low melting point and ability to wet glass and porcelain.' },
        { symbol: 'Ge', name: 'Germanium', number: '32', category: 'metalloids', atomic_mass: '72.630', electron_configuration: '[Ar] 3d¹⁰ 4s² 4p²', state: 'Solid', melting_point: '938.25°C', boiling_point: '2833°C', density: '5.32 g/cm³', description: 'Germanium is a lustrous, hard, grayish-white metalloid in the carbon group. It is a semiconductor and is commonly used in transistors and various electronic devices.' },
        { symbol: 'As', name: 'Arsenic', number: '33', category: 'metalloids', atomic_mass: '74.922', electron_configuration: '[Ar] 3d¹⁰ 4s² 4p³', state: 'Solid', melting_point: '817°C (at pressure)', boiling_point: '614°C (sublimes)', density: '5.73 g/cm³', description: 'Arsenic is a metalloid that exists in many allotropes. It is notoriously poisonous to multicellular life, although a few species of bacteria are able to use arsenic compounds as respiratory metabolites.' },
        { symbol: 'Se', name: 'Selenium', number: '34', category: 'nonmetals', atomic_mass: '78.971', electron_configuration: '[Ar] 3d¹⁰ 4s² 4p⁴', state: 'Solid', melting_point: '221°C', boiling_point: '685°C', density: '4.81 g/cm³', description: 'Selenium is a nonmetal with properties that are intermediate between the elements above and below in the periodic table, sulfur and tellurium. It is an essential micronutrient for some species, including humans.' },
        { symbol: 'Br', name: 'Bromine', number: '35', category: 'halogens', atomic_mass: '79.904', electron_configuration: '[Ar] 3d¹⁰ 4s² 4p⁵', state: 'Liquid', melting_point: '-7.3°C', boiling_point: '58.8°C', density: '3.11 g/cm³', description: 'Bromine is the third-lightest halogen, and is a fuming red-brown liquid at room temperature that evaporates readily to form a similarly colored gas. It is a reactive element and is highly soluble in water.' },
        { symbol: 'Kr', name: 'Krypton', number: '36', category: 'noble-gases', atomic_mass: '83.798', electron_configuration: '[Ar] 3d¹⁰ 4s² 4p⁶', state: 'Gas', melting_point: '-157.36°C', boiling_point: '-153.22°C', density: '0.003733 g/cm³', description: 'Krypton is a member of the noble gases. It is colorless, odorless, tasteless, and monatomic. It occurs in trace amounts in the atmosphere and is often used with other rare gases in fluorescent lamps.' },
        
        // Period 5
        { symbol: 'Rb', name: 'Rubidium', number: '37', category: 'alkali-metals', atomic_mass: '85.468', electron_configuration: '[Kr] 5s¹', state: 'Solid', melting_point: '39.31°C', boiling_point: '688°C', density: '1.53 g/cm³', description: 'Rubidium is a very soft, silvery-white metal in the alkali metal group. It is highly reactive, with properties similar to other alkali metals, including rapid oxidation in air.' },
        { symbol: 'Sr', name: 'Strontium', number: '38', category: 'alkaline-earth-metals', atomic_mass: '87.62', electron_configuration: '[Kr] 5s²', state: 'Solid', melting_point: '777°C', boiling_point: '1377°C', density: '2.64 g/cm³', description: 'Strontium is a soft, silvery, alkaline earth metal that rapidly reacts with air to take on a yellowish color. It is highly reactive chemically and is never found as a free element in nature.' },
        { symbol: 'Y', name: 'Yttrium', number: '39', category: 'transition-metals', atomic_mass: '88.906', electron_configuration: '[Kr] 4d¹ 5s²', state: 'Solid', melting_point: '1526°C', boiling_point: '3336°C', density: '4.47 g/cm³', description: 'Yttrium is a silvery-metallic transition metal chemically similar to the lanthanides and has often been classified as a "rare-earth element". It is used in the production of various materials.' },
        { symbol: 'Zr', name: 'Zirconium', number: '40', category: 'transition-metals', atomic_mass: '91.224', electron_configuration: '[Kr] 4d² 5s²', state: 'Solid', melting_point: '1855°C', boiling_point: '4409°C', density: '6.52 g/cm³', description: 'Zirconium is a lustrous, grey-white, strong transition metal that resembles hafnium and, to a lesser extent, titanium. It is highly resistant to corrosion.' },
        { symbol: 'Nb', name: 'Niobium', number: '41', category: 'transition-metals', atomic_mass: '92.906', electron_configuration: '[Kr] 4d⁴ 5s¹', state: 'Solid', melting_point: '2477°C', boiling_point: '4744°C', density: '8.57 g/cm³', description: 'Niobium is a soft, grey, ductile transition metal, often found in the minerals pyrochlore and columbite. It is used in various superconducting materials.' },
        { symbol: 'Mo', name: 'Molybdenum', number: '42', category: 'transition-metals', atomic_mass: '95.95', electron_configuration: '[Kr] 4d⁵ 5s¹', state: 'Solid', melting_point: '2623°C', boiling_point: '4639°C', density: '10.28 g/cm³', description: 'Molybdenum is a silvery metal with a gray cast, and has the sixth-highest melting point of any element. It readily forms hard, stable carbides, and for this reason it is often used in high-strength steel alloys.' },
        { symbol: 'Tc', name: 'Technetium', number: '43', category: 'transition-metals', atomic_mass: '98', electron_configuration: '[Kr] 4d⁵ 5s²', state: 'Solid', melting_point: '2157°C', boiling_point: '4265°C', density: '11.5 g/cm³', description: 'Technetium is the lightest element whose isotopes are all radioactive; none are stable. It is obtained from spent nuclear fuel rods. It is used in nuclear medicine for a wide variety of diagnostic tests.' },
        { symbol: 'Ru', name: 'Ruthenium', number: '44', category: 'transition-metals', atomic_mass: '101.07', electron_configuration: '[Kr] 4d⁷ 5s¹', state: 'Solid', melting_point: '2334°C', boiling_point: '4150°C', density: '12.45 g/cm³', description: 'Ruthenium is a rare transition metal belonging to the platinum group. It is a hard, silvery-white metal with a shiny surface. It is used in electronics, as a catalyst, and in jewelry.' },
        { symbol: 'Rh', name: 'Rhodium', number: '45', category: 'transition-metals', atomic_mass: '102.91', electron_configuration: '[Kr] 4d⁸ 5s¹', state: 'Solid', melting_point: '1964°C', boiling_point: '3695°C', density: '12.41 g/cm³', description: 'Rhodium is a rare, silvery-white, hard, corrosion-resistant, and chemically inert transition metal. It is a noble metal and a member of the platinum group.' },
        { symbol: 'Pd', name: 'Palladium', number: '46', category: 'transition-metals', atomic_mass: '106.42', electron_configuration: '[Kr] 4d¹⁰', state: 'Solid', melting_point: '1554.9°C', boiling_point: '2963°C', density: '12.02 g/cm³', description: 'Palladium is a rare and lustrous silvery-white metal that resembles platinum. It is one of the six platinum-group metals and is used in many catalytic converters.' },
        { symbol: 'Ag', name: 'Silver', number: '47', category: 'transition-metals', atomic_mass: '107.87', electron_configuration: '[Kr] 4d¹⁰ 5s¹', state: 'Solid', melting_point: '961.78°C', boiling_point: '2162°C', density: '10.49 g/cm³', description: 'Silver is a soft, white, lustrous transition metal with the highest electrical conductivity, thermal conductivity, and reflectivity of any metal. It is used in coins, jewelry, and photography.' },
        { symbol: 'Cd', name: 'Cadmium', number: '48', category: 'transition-metals', atomic_mass: '112.41', electron_configuration: '[Kr] 4d¹⁰ 5s²', state: 'Solid', melting_point: '321.07°C', boiling_point: '767°C', density: '8.65 g/cm³', description: 'Cadmium is a soft, bluish-white metal that is chemically similar to zinc. It is highly toxic and has been used in batteries, pigments, and as a barrier to control nuclear fission.' },
        { symbol: 'In', name: 'Indium', number: '49', category: 'post-transition-metals', atomic_mass: '114.82', electron_configuration: '[Kr] 4d¹⁰ 5s² 5p¹', state: 'Solid', melting_point: '156.6°C', boiling_point: '2072°C', density: '7.31 g/cm³', description: 'Indium is a soft, malleable post-transition metal with a bright luster. It is most commonly used in the semiconductor industry for making LCD screens and solar panels.' },
        { symbol: 'Sn', name: 'Tin', number: '50', category: 'post-transition-metals', atomic_mass: '118.71', electron_configuration: '[Kr] 4d¹⁰ 5s² 5p²', state: 'Solid', melting_point: '231.93°C', boiling_point: '2602°C', density: '7.31 g/cm³', description: 'Tin is a silvery metal that characteristically has a faint yellow hue. It is soft, malleable, and resistant to corrosion, making it ideal for use in many alloys and as a coating for other metals.' },
        { symbol: 'Sb', name: 'Antimony', number: '51', category: 'metalloids', atomic_mass: '121.76', electron_configuration: '[Kr] 4d¹⁰ 5s² 5p³', state: 'Solid', melting_point: '630.63°C', boiling_point: '1587°C', density: '6.68 g/cm³', description: 'Antimony is a lustrous gray metalloid with a Mohs scale hardness of 3. It is stable in air and moisture at room temperature. It is mainly used in alloys and flame retardants.' },
        { symbol: 'Te', name: 'Tellurium', number: '52', category: 'metalloids', atomic_mass: '127.60', electron_configuration: '[Kr] 4d¹⁰ 5s² 5p⁴', state: 'Solid', melting_point: '449.51°C', boiling_point: '988°C', density: '6.24 g/cm³', description: 'Tellurium is a brittle, mildly toxic, rare, silver-white metalloid. It is primarily used in alloys and as a semiconductor in solar panels and electronics.' },
        { symbol: 'I', name: 'Iodine', number: '53', category: 'halogens', atomic_mass: '126.90', electron_configuration: '[Kr] 4d¹⁰ 5s² 5p⁵', state: 'Solid', melting_point: '113.7°C', boiling_point: '184.3°C', density: '4.93 g/cm³', description: 'Iodine is a dark-gray/purple-black solid that sublimes readily to form a violet gas. It is the heaviest essential mineral nutrient and is commonly used in medicine and photography.' },
        { symbol: 'Xe', name: 'Xenon', number: '54', category: 'noble-gases', atomic_mass: '131.29', electron_configuration: '[Kr] 4d¹⁰ 5s² 5p⁶', state: 'Gas', melting_point: '-111.8°C', boiling_point: '-108.1°C', density: '0.005894 g/cm³', description: 'Xenon is a colorless, dense, odorless noble gas. It is used in light-emitting devices, flash lamps, and as an anesthetic. It was the first noble gas found to form true chemical compounds.' },
        
        // Period 6
        { symbol: 'Cs', name: 'Cesium', number: '55', category: 'alkali-metals', atomic_mass: '132.91', electron_configuration: '[Xe] 6s¹', state: 'Solid', melting_point: '28.44°C', boiling_point: '671°C', density: '1.93 g/cm³', description: 'Cesium is a soft, silvery-golden alkali metal with a melting point of 28.5°C, which makes it one of only five elemental metals that are liquid at or near room temperature.' },
        { symbol: 'Ba', name: 'Barium', number: '56', category: 'alkaline-earth-metals', atomic_mass: '137.33', electron_configuration: '[Xe] 6s²', state: 'Solid', melting_point: '727°C', boiling_point: '1897°C', density: '3.51 g/cm³', description: 'Barium is a soft, silvery alkaline earth metal that oxidizes rapidly in air. It is never found in nature as a free element. All barium compounds are toxic.' },
        
        // Lanthanides (57-71)
        { symbol: 'La', name: 'Lanthanum', number: '57', category: 'lanthanides', atomic_mass: '138.91', electron_configuration: '[Xe] 5d¹ 6s²', state: 'Solid', melting_point: '920°C', boiling_point: '3464°C', density: '6.15 g/cm³', description: 'Lanthanum is a soft, ductile, silvery-white metal that tarnishes rapidly when exposed to air. It is the first element in the lanthanide series.' },
        { symbol: 'Ce', name: 'Cerium', number: '58', category: 'lanthanides', atomic_mass: '140.12', electron_configuration: '[Xe] 4f¹ 5d¹ 6s²', state: 'Solid', melting_point: '795°C', boiling_point: '3443°C', density: '6.77 g/cm³', description: 'Cerium is a soft, silvery, ductile metal which easily oxidizes in air. It is the most abundant of the rare earth elements and has various applications in metallurgy, electronics, and chemical catalysis.' },
        { symbol: 'Pr', name: 'Praseodymium', number: '59', category: 'lanthanides', atomic_mass: '140.91', electron_configuration: '[Xe] 4f³ 6s²', state: 'Solid', melting_point: '931°C', boiling_point: '3520°C', density: '6.77 g/cm³', description: 'Praseodymium is a soft, silvery, malleable and ductile metal, valued for its magnetic, electrical, chemical, and optical properties. It is used in rare-earth magnets and as a component in various alloys.' },
        { symbol: 'Nd', name: 'Neodymium', number: '60', category: 'lanthanides', atomic_mass: '144.24', electron_configuration: '[Xe] 4f⁴ 6s²', state: 'Solid', melting_point: '1016°C', boiling_point: '3074°C', density: '7.01 g/cm³', description: 'Neodymium is a soft silvery metal that tarnishes in air. It is one of the more reactive rare earth metals and is used to make the strongest permanent magnets.' },
        { symbol: 'Pm', name: 'Promethium', number: '61', category: 'lanthanides', atomic_mass: '145', electron_configuration: '[Xe] 4f⁵ 6s²', state: 'Solid', melting_point: '1042°C', boiling_point: '3000°C', density: '7.26 g/cm³', description: 'Promethium is a rare radioactive metal that does not occur naturally on Earth. All of its isotopes are radioactive. It is used in specialized atomic batteries and as a light source for signals.' },
        { symbol: 'Sm', name: 'Samarium', number: '62', category: 'lanthanides', atomic_mass: '150.36', electron_configuration: '[Xe] 4f⁶ 6s²', state: 'Solid', melting_point: '1072°C', boiling_point: '1794°C', density: '7.52 g/cm³', description: 'Samarium is a moderately hard silvery metal that readily oxidizes in air. It is used in magnets, catalysts, and in cancer treatments.' },
        { symbol: 'Eu', name: 'Europium', number: '63', category: 'lanthanides', atomic_mass: '151.96', electron_configuration: '[Xe] 4f⁷ 6s²', state: 'Solid', melting_point: '822°C', boiling_point: '1529°C', density: '5.24 g/cm³', description: 'Europium is a moderately hard, silvery metal which readily oxidizes in air and water. It is the most reactive of the rare earth elements and is used in the production of red and blue phosphors for displays.' },
        { symbol: 'Gd', name: 'Gadolinium', number: '64', category: 'lanthanides', atomic_mass: '157.25', electron_configuration: '[Xe] 4f⁷ 5d¹ 6s²', state: 'Solid', melting_point: '1313°C', boiling_point: '3273°C', density: '7.90 g/cm³', description: 'Gadolinium is a silvery-white, malleable, and ductile rare earth metal. It has exceptional magnetic properties and is used in MRI machines, nuclear reactors, and various electronic components.' },
        { symbol: 'Tb', name: 'Terbium', number: '65', category: 'lanthanides', atomic_mass: '158.93', electron_configuration: '[Xe] 4f⁹ 6s²', state: 'Solid', melting_point: '1356°C', boiling_point: '3230°C', density: '8.23 g/cm³', description: 'Terbium is a silvery-white, rare earth metal that is malleable, ductile, and soft enough to be cut with a knife. It is used in solid-state devices and as a green phosphor in display technology.' },
        { symbol: 'Dy', name: 'Dysprosium', number: '66', category: 'lanthanides', atomic_mass: '162.50', electron_configuration: '[Xe] 4f¹⁰ 6s²', state: 'Solid', melting_point: '1412°C', boiling_point: '2567°C', density: '8.55 g/cm³', description: 'Dysprosium is a rare earth element with a metallic, bright silver luster. It is relatively stable in air at room temperature but dissolves readily in dilute acids. It is used in various high-tech applications.' },
        { symbol: 'Ho', name: 'Holmium', number: '67', category: 'lanthanides', atomic_mass: '164.93', electron_configuration: '[Xe] 4f¹¹ 6s²', state: 'Solid', melting_point: '1474°C', boiling_point: '2700°C', density: '8.80 g/cm³', description: 'Holmium is a relatively soft and malleable silvery-white metal. It has the highest magnetic strength of any element and is used in nuclear control rods and microwave equipment.' },
        { symbol: 'Er', name: 'Erbium', number: '68', category: 'lanthanides', atomic_mass: '167.26', electron_configuration: '[Xe] 4f¹² 6s²', state: 'Solid', melting_point: '1529°C', boiling_point: '2868°C', density: '9.07 g/cm³', description: 'Erbium is a silvery-white solid metal when artificially isolated, natural erbium is always found in chemical combination with other elements. It is used in nuclear technology and fiber-optic communications.' },
        { symbol: 'Tm', name: 'Thulium', number: '69', category: 'lanthanides', atomic_mass: '168.93', electron_configuration: '[Xe] 4f¹³ 6s²', state: 'Solid', melting_point: '1545°C', boiling_point: '1950°C', density: '9.32 g/cm³', description: 'Thulium is the thirteenth and third-last element in the lanthanide series. It is an easily workable metal with a bright silvery-gray luster. It is used in portable X-ray devices and lasers.' },
        { symbol: 'Yb', name: 'Ytterbium', number: '70', category: 'lanthanides', atomic_mass: '173.05', electron_configuration: '[Xe] 4f¹⁴ 6s²', state: 'Solid', melting_point: '819°C', boiling_point: '1196°C', density: '6.90 g/cm³', description: 'Ytterbium is a soft, malleable and ductile chemical element that displays a bright silvery luster when pure. It is used in stainless steel, electronics, and as a radiation source in portable X-ray machines.' },
        { symbol: 'Lu', name: 'Lutetium', number: '71', category: 'lanthanides', atomic_mass: '174.97', electron_configuration: '[Xe] 4f¹⁴ 5d¹ 6s²', state: 'Solid', melting_point: '1663°C', boiling_point: '3402°C', density: '9.84 g/cm³', description: 'Lutetium is a silvery white metal, which resists corrosion in dry air, but not in moist air. It is the last element in the lanthanide series, and is traditionally counted among the rare earths.' },
        
        // Continuing Period 6 (after lanthanides)
        { symbol: 'Hf', name: 'Hafnium', number: '72', category: 'transition-metals', atomic_mass: '178.49', electron_configuration: '[Xe] 4f¹⁴ 5d² 6s²', state: 'Solid', melting_point: '2233°C', boiling_point: '4603°C', density: '13.31 g/cm³', description: 'Hafnium is a lustrous, silvery gray, tetravalent transition metal. It is corrosion-resistant and chemically similar to zirconium. It is used in nuclear reactors and superalloys.' },
        { symbol: 'Ta', name: 'Tantalum', number: '73', category: 'transition-metals', atomic_mass: '180.95', electron_configuration: '[Xe] 4f¹⁴ 5d³ 6s²', state: 'Solid', melting_point: '3017°C', boiling_point: '5458°C', density: '16.69 g/cm³', description: 'Tantalum is a rare, hard, blue-gray, lustrous transition metal that is highly corrosion-resistant. It is used in electronic components, surgical implants, and high-temperature applications.' },
        { symbol: 'W', name: 'Tungsten', number: '74', category: 'transition-metals', atomic_mass: '183.84', electron_configuration: '[Xe] 4f¹⁴ 5d⁴ 6s²', state: 'Solid', melting_point: '3422°C', boiling_point: '5555°C', density: '19.25 g/cm³', description: 'Tungsten is a rare metal found naturally on Earth almost exclusively combined with other elements. It has the highest melting point of all the elements and is used in light bulb filaments and high-temperature applications.' },
        { symbol: 'Re', name: 'Rhenium', number: '75', category: 'transition-metals', atomic_mass: '186.21', electron_configuration: '[Xe] 4f¹⁴ 5d⁵ 6s²', state: 'Solid', melting_point: '3186°C', boiling_point: '5596°C', density: '21.02 g/cm³', description: 'Rhenium is a silvery-white, heavy, third-row transition metal. It has one of the highest melting points of all elements and is used in high-temperature superalloys and catalysts.' },
        { symbol: 'Os', name: 'Osmium', number: '76', category: 'transition-metals', atomic_mass: '190.23', electron_configuration: '[Xe] 4f¹⁴ 5d⁶ 6s²', state: 'Solid', melting_point: '3033°C', boiling_point: '5012°C', density: '22.59 g/cm³', description: 'Osmium is a hard, brittle, bluish-white transition metal in the platinum group. It is the densest naturally occurring element and is used in alloys, electrical contacts, and fountain pen tips.' },
        { symbol: 'Ir', name: 'Iridium', number: '77', category: 'transition-metals', atomic_mass: '192.22', electron_configuration: '[Xe] 4f¹⁴ 5d⁷ 6s²', state: 'Solid', melting_point: '2446°C', boiling_point: '4428°C', density: '22.56 g/cm³', description: 'Iridium is a very hard, brittle, silvery-white transition metal of the platinum group. It is the second-densest element and is notable for its resistance to corrosion.' },
        { symbol: 'Pt', name: 'Platinum', number: '78', category: 'transition-metals', atomic_mass: '195.08', electron_configuration: '[Xe] 4f¹⁴ 5d⁹ 6s¹', state: 'Solid', melting_point: '1768.3°C', boiling_point: '3825°C', density: '21.45 g/cm³', description: 'Platinum is a dense, malleable, ductile, highly unreactive, precious, silverish-white transition metal. It is used in catalytic converters, laboratory equipment, electrical contacts, and jewelry.' },
        { symbol: 'Au', name: 'Gold', number: '79', category: 'transition-metals', atomic_mass: '196.97', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', state: 'Solid', melting_point: '1064.18°C', boiling_point: '2856°C', density: '19.32 g/cm³', description: 'Gold is a bright, slightly reddish yellow, dense, soft, malleable, and ductile metal. It is one of the least reactive chemical elements and is solid under standard conditions.' },
        { symbol: 'Hg', name: 'Mercury', number: '80', category: 'transition-metals', atomic_mass: '200.59', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', state: 'Liquid', melting_point: '-38.83°C', boiling_point: '356.73°C', density: '13.53 g/cm³', description: 'Mercury is a heavy, silvery-white liquid metal. It is the only metallic element that is liquid at standard conditions for temperature and pressure. It is used in thermometers, barometers, and other scientific apparatus.' },
        { symbol: 'Tl', name: 'Thallium', number: '81', category: 'post-transition-metals', atomic_mass: '204.38', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', state: 'Solid', melting_point: '304°C', boiling_point: '1473°C', density: '11.85 g/cm³', description: 'Thallium is a soft gray post-transition metal that is not found free in nature. It is highly toxic and has been used in rat poisons and insecticides, though many of these applications have been discontinued due to safety concerns.' },
        { symbol: 'Pb', name: 'Lead', number: '82', category: 'post-transition-metals', atomic_mass: '207.2', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', state: 'Solid', melting_point: '327.46°C', boiling_point: '1749°C', density: '11.34 g/cm³', description: 'Lead is a heavy metal that is denser than most common materials. It is soft and malleable, and has a relatively low melting point. It has been used in construction, batteries, bullets, and as a radiation shield.' },
        { symbol: 'Bi', name: 'Bismuth', number: '83', category: 'post-transition-metals', atomic_mass: '208.98', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', state: 'Solid', melting_point: '271.4°C', boiling_point: '1564°C', density: '9.78 g/cm³', description: 'Bismuth is a brittle metal with a silvery-white color when freshly produced, but surface oxidation can give it an iridescent tinge. It is the most naturally diamagnetic element and has one of the lowest thermal conductivities among metals.' },
        { symbol: 'Po', name: 'Polonium', number: '84', category: 'post-transition-metals', atomic_mass: '209', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', state: 'Solid', melting_point: '254°C', boiling_point: '962°C', density: '9.32 g/cm³', description: 'Polonium is a rare and highly radioactive metal with no stable isotopes. It is chemically similar to bismuth and tellurium. Due to its intense radioactivity, it has limited applications, primarily in anti-static devices and as a heat source in space satellites.' },
        { symbol: 'At', name: 'Astatine', number: '85', category: 'halogens', atomic_mass: '210', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', state: 'Solid', melting_point: '302°C', boiling_point: '337°C', density: '7 g/cm³', description: 'Astatine is the rarest naturally occurring element in the Earth\'s crust. All its isotopes are short-lived; the most stable has a half-life of only 8.1 hours. It is the heaviest known halogen.' },
        { symbol: 'Rn', name: 'Radon', number: '86', category: 'noble-gases', atomic_mass: '222', electron_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', state: 'Gas', melting_point: '-71°C', boiling_point: '-61.7°C', density: '0.00973 g/cm³', description: 'Radon is a radioactive, colorless, odorless, tasteless noble gas. It is the heaviest known gas and is considered a health hazard due to its radioactivity. It is used in radiotherapy and as a tracer in leak detection.' },
        
        // Period 7
        { symbol: 'Fr', name: 'Francium', number: '87', category: 'alkali-metals', atomic_mass: '223', electron_configuration: '[Rn] 7s¹', state: 'Solid', melting_point: '27°C', boiling_point: '677°C', density: '1.87 g/cm³', description: 'Francium is the second-least electronegative element, behind only cesium, and is the second rarest naturally occurring element. It is highly radioactive; its most stable isotope has a half-life of only 22 minutes.' },
        { symbol: 'Ra', name: 'Radium', number: '88', category: 'alkaline-earth-metals', atomic_mass: '226', electron_configuration: '[Rn] 7s²', state: 'Solid', melting_point: '700°C', boiling_point: '1737°C', density: '5.5 g/cm³', description: 'Radium is a luminous, highly radioactive element. It was discovered by Marie and Pierre Curie in 1898 and was formerly used in self-luminous paints for watches, aircraft switches, and instrument dials.' },
        
        // Actinides (89-103)
        { symbol: 'Ac', name: 'Actinium', number: '89', category: 'actinides', atomic_mass: '227', electron_configuration: '[Rn] 6d¹ 7s²', state: 'Solid', melting_point: '1050°C', boiling_point: '3200°C', density: '10.07 g/cm³', description: 'Actinium is a soft, silvery-white radioactive metal. It glows in the dark with a pale blue light due to its intense radioactivity. All its isotopes are radioactive, with the most stable having a half-life of 21.77 years.' },
        { symbol: 'Th', name: 'Thorium', number: '90', category: 'actinides', atomic_mass: '232.04', electron_configuration: '[Rn] 6d² 7s²', state: 'Solid', melting_point: '1750°C', boiling_point: '4788°C', density: '11.72 g/cm³', description: 'Thorium is a weakly radioactive metallic chemical element. It has been used as a source of nuclear power and in high-temperature laboratory crucibles.' },
        { symbol: 'Pa', name: 'Protactinium', number: '91', category: 'actinides', atomic_mass: '231.04', electron_configuration: '[Rn] 5f² 6d¹ 7s²', state: 'Solid', melting_point: '1568°C', boiling_point: '4027°C', density: '15.37 g/cm³', description: 'Protactinium is a dense, silvery-gray actinide metal that is highly radioactive. Due to its scarcity, high radioactivity, and toxicity, it has few uses beyond scientific research.' },
        { symbol: 'U', name: 'Uranium', number: '92', category: 'actinides', atomic_mass: '238.03', electron_configuration: '[Rn] 5f³ 6d¹ 7s²', state: 'Solid', melting_point: '1132.2°C', boiling_point: '4131°C', density: '19.1 g/cm³', description: 'Uranium is a silvery-white metal with very high density. It is weakly radioactive and is primarily used in nuclear power plants and nuclear weapons.' },
        { symbol: 'Np', name: 'Neptunium', number: '93', category: 'actinides', atomic_mass: '237', electron_configuration: '[Rn] 5f⁴ 6d¹ 7s²', state: 'Solid', melting_point: '644°C', boiling_point: '3902°C', density: '20.45 g/cm³', description: 'Neptunium is a radioactive actinide metal, the first transuranic element. It is silvery in appearance and is obtained as a by-product from nuclear reactors.' },
        { symbol: 'Pu', name: 'Plutonium', number: '94', category: 'actinides', atomic_mass: '244', electron_configuration: '[Rn] 5f⁶ 7s²', state: 'Solid', melting_point: '640°C', boiling_point: '3228°C', density: '19.82 g/cm³', description: 'Plutonium is a radioactive actinide metal of silvery appearance that tarnishes when exposed to air. It is used in nuclear weapons and as a fuel in nuclear reactors.' },
        { symbol: 'Am', name: 'Americium', number: '95', category: 'actinides', atomic_mass: '243', electron_configuration: '[Rn] 5f⁷ 7s²', state: 'Solid', melting_point: '1176°C', boiling_point: '2607°C', density: '13.67 g/cm³', description: 'Americium is a synthetic radioactive element that is silvery-white in appearance. It is used in smoke detectors and as a portable source of gamma rays.' },
        { symbol: 'Cm', name: 'Curium', number: '96', category: 'actinides', atomic_mass: '247', electron_configuration: '[Rn] 5f⁷ 6d¹ 7s²', state: 'Solid', melting_point: '1345°C', boiling_point: '3110°C', density: '13.51 g/cm³', description: 'Curium is a hard, dense, silvery radioactive metal. It is primarily used for scientific research and has few practical applications outside the laboratory.' },
        { symbol: 'Bk', name: 'Berkelium', number: '97', category: 'actinides', atomic_mass: '247', electron_configuration: '[Rn] 5f⁹ 7s²', state: 'Solid', melting_point: '1050°C', boiling_point: 'Unknown', density: '14.78 g/cm³', description: 'Berkelium is a transuranic radioactive element that is silvery-white in appearance. It has no significant commercial applications and is primarily used for scientific research.' },
        { symbol: 'Cf', name: 'Californium', number: '98', category: 'actinides', atomic_mass: '251', electron_configuration: '[Rn] 5f¹⁰ 7s²', state: 'Solid', melting_point: '900°C', boiling_point: 'Unknown', density: '15.1 g/cm³', description: 'Californium is a radioactive actinide element produced in particle accelerators. It is used as a neutron source for the detection of gold and silver ores and in portable metal detectors.' },
        { symbol: 'Es', name: 'Einsteinium', number: '99', category: 'actinides', atomic_mass: '252', electron_configuration: '[Rn] 5f¹¹ 7s²', state: 'Solid', melting_point: '860°C', boiling_point: 'Unknown', density: '8.84 g/cm³', description: 'Einsteinium is a synthetic element with a silvery appearance. It has no known uses outside of scientific research due to its high radioactivity and short half-life.' },
        { symbol: 'Fm', name: 'Fermium', number: '100', category: 'actinides', atomic_mass: '257', electron_configuration: '[Rn] 5f¹² 7s²', state: 'Solid', melting_point: '1527°C', boiling_point: 'Unknown', density: 'Unknown', description: 'Fermium is a synthetic element that has not been observed in nature. It was discovered in the debris of the first hydrogen bomb explosion and is named after Enrico Fermi.' },
        { symbol: 'Md', name: 'Mendelevium', number: '101', category: 'actinides', atomic_mass: '258', electron_configuration: '[Rn] 5f¹³ 7s²', state: 'Solid', melting_point: '827°C', boiling_point: 'Unknown', density: 'Unknown', description: 'Mendelevium is a synthetic element that was first synthesized by bombarding einsteinium with alpha particles. It is named after Dmitri Mendeleev, the creator of the periodic table.' },
        { symbol: 'No', name: 'Nobelium', number: '102', category: 'actinides', atomic_mass: '259', electron_configuration: '[Rn] 5f¹⁴ 7s²', state: 'Solid', melting_point: '827°C', boiling_point: 'Unknown', density: 'Unknown', description: 'Nobelium is a synthetic radioactive element named after Alfred Nobel. It has only been produced in laboratories in very small amounts.' },
        { symbol: 'Lr', name: 'Lawrencium', number: '103', category: 'actinides', atomic_mass: '266', electron_configuration: '[Rn] 5f¹⁴ 7s² 7p¹', state: 'Solid', melting_point: '1627°C', boiling_point: 'Unknown', density: 'Unknown', description: 'Lawrencium is a synthetic radioactive element that was named after Ernest Lawrence, inventor of the cyclotron. It is the last element in the actinide series.' },
        
        // Continuing Period 7 (after actinides)
        { symbol: 'Rf', name: 'Rutherfordium', number: '104', category: 'transition-metals', atomic_mass: '267', electron_configuration: '[Rn] 5f¹⁴ 6d² 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: '23 g/cm³', description: 'Rutherfordium is a synthetic element named after Ernest Rutherford. It is the first transactinide element and belongs to the group 4 elements.' },
        { symbol: 'Db', name: 'Dubnium', number: '105', category: 'transition-metals', atomic_mass: '268', electron_configuration: '[Rn] 5f¹⁴ 6d³ 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: '29 g/cm³', description: 'Dubnium is a synthetic element named after the city of Dubna in Russia, where it was first synthesized. It is a transactinide element with no known uses outside of research.' },
        { symbol: 'Sg', name: 'Seaborgium', number: '106', category: 'transition-metals', atomic_mass: '269', electron_configuration: '[Rn] 5f¹⁴ 6d⁴ 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: '35 g/cm³', description: 'Seaborgium is a synthetic element named after Glenn T. Seaborg. It is a transactinide element that has only been produced in laboratories in very small amounts.' },
        { symbol: 'Bh', name: 'Bohrium', number: '107', category: 'transition-metals', atomic_mass: '270', electron_configuration: '[Rn] 5f¹⁴ 6d⁵ 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: '37 g/cm³', description: 'Bohrium is a synthetic element named after Niels Bohr. It is a transactinide element with no known uses outside of scientific research.' },
        { symbol: 'Hs', name: 'Hassium', number: '108', category: 'transition-metals', atomic_mass: '277', electron_configuration: '[Rn] 5f¹⁴ 6d⁶ 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: '41 g/cm³', description: 'Hassium is a synthetic element named after the German state of Hesse. It is a transactinide element that has only been produced in laboratories in very small amounts.' },
        { symbol: 'Mt', name: 'Meitnerium', number: '109', category: 'transition-metals', atomic_mass: '278', electron_configuration: '[Rn] 5f¹⁴ 6d⁷ 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: '35 g/cm³', description: 'Meitnerium is a synthetic element named after Lise Meitner. It is a transactinide element with no known uses outside of scientific research.' },
        { symbol: 'Ds', name: 'Darmstadtium', number: '110', category: 'transition-metals', atomic_mass: '281', electron_configuration: '[Rn] 5f¹⁴ 6d⁸ 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Darmstadtium is a synthetic element named after Darmstadt, Germany, where it was first created. It is a transactinide element that has only been produced in laboratories.' },
        { symbol: 'Rg', name: 'Roentgenium', number: '111', category: 'transition-metals', atomic_mass: '282', electron_configuration: '[Rn] 5f¹⁴ 6d⁹ 7s²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Roentgenium is a synthetic element named after Wilhelm Conrad Röntgen. It is a transactinide element with no known uses outside of scientific research.' },
        { symbol: 'Cn', name: 'Copernicium', number: '112', category: 'transition-metals', atomic_mass: '285', electron_configuration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', state: 'Liquid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Copernicium is a synthetic element named after Nicolaus Copernicus. It is a transactinide element that may have properties similar to mercury.' },
        { symbol: 'Nh', name: 'Nihonium', number: '113', category: 'post-transition-metals', atomic_mass: '286', electron_configuration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Nihonium is a synthetic element named after Japan (Nihon in Japanese). It is the first element to be discovered in an Asian country.' },
        { symbol: 'Fl', name: 'Flerovium', number: '114', category: 'post-transition-metals', atomic_mass: '289', electron_configuration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Flerovium is a synthetic element named after the Flerov Laboratory of Nuclear Reactions. It is a transactinide element that may have properties similar to lead.' },
        { symbol: 'Mc', name: 'Moscovium', number: '115', category: 'post-transition-metals', atomic_mass: '290', electron_configuration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Moscovium is a synthetic element named after the Moscow Oblast in Russia. It is a transactinide element with no known uses outside of scientific research.' },
        { symbol: 'Lv', name: 'Livermorium', number: '116', category: 'post-transition-metals', atomic_mass: '293', electron_configuration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Livermorium is a synthetic element named after the Lawrence Livermore National Laboratory. It is a transactinide element with no known uses outside of scientific research.' },
        { symbol: 'Ts', name: 'Tennessine', number: '117', category: 'halogens', atomic_mass: '294', electron_configuration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Tennessine is a synthetic element named after the state of Tennessee. It is expected to be a halogen, but its chemical properties have not been experimentally confirmed.' },
        { symbol: 'Og', name: 'Oganesson', number: '118', category: 'noble-gases', atomic_mass: '294', electron_configuration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', state: 'Solid', melting_point: 'Unknown', boiling_point: 'Unknown', density: 'Unknown', description: 'Oganesson is a synthetic element named after Yuri Oganessian. It is expected to be a noble gas, but may behave more like a solid due to relativistic effects.' }
    ];
    
    // Add custom styles for the periodic table grid
    const style = document.createElement('style');
    style.textContent = `
        .grid-cols-18 {
            grid-template-columns: repeat(18, minmax(0, 1fr));
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the periodic table
    initPeriodicTable();
});

// Add 3D icon for the periodic table to the Tool3DIcon object
if (typeof Tool3DIcon !== 'undefined') {
    // Store the original createToolIcon function if it exists
    const originalCreateToolIcon = Tool3DIcon.createToolIcon;
    
    // Override the createToolIcon function
    Tool3DIcon.createToolIcon = function(toolType) {
        // Create the appropriate 3D icon based on tool type
        if (toolType === 'periodic-table') {
            createPeriodicTableIcon();
        } else if (originalCreateToolIcon) {
            // Call the original function for other tool types
            originalCreateToolIcon.call(this, toolType);
        }
        
        // Create periodic table icon
        function createPeriodicTableIcon() {
            // Create a group for the periodic table icon
            const periodicTableGroup = new THREE.Group();
            
            // Color palette
            const colors = {
                primary: 0x3B82F6,   // Blue
                secondary: 0x10B981, // Green
                accent: 0x8B5CF6,    // Purple
                dark: 0x1F2937,      // Dark gray
                light: 0xF3F4F6      // Light gray
            };
            
            // Create a base for the periodic table
            const base = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.2, 2),
                new THREE.MeshStandardMaterial({ 
                    color: colors.dark,
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            periodicTableGroup.add(base);
            
            // Create element cells (simplified periodic table representation)
            const cellSize = 0.3;
            const spacing = 0.05;
            const startX = -1.35;
            const startZ = -0.85;
            
            // Create a 5x5 grid of element cells
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    // Skip some cells to create the periodic table shape
                    if ((row < 2 && col > 0 && col < 4) || (row === 0 && col === 4)) {
                        continue;
                    }
                    
                    // Determine cell color based on position (simulating element categories)
                    let cellColor;
                    if (row === 0 && col === 0) cellColor = colors.secondary; // H
                    else if (row === 0 && col === 4) cellColor = colors.accent; // He
                    else if (col === 0) cellColor = colors.primary; // Alkali metals
                    else if (col === 1) cellColor = 0xFCD34D; // Alkaline earth metals
                    else if (col >= 2 && col <= 3 && row >= 2) cellColor = 0xA78BFA; // Transition metals
                    else if (col === 4 && row >= 1) cellColor = 0xF87171; // Noble gases
                    else cellColor = 0x6EE7B7; // Other elements
                    
                    // Create cell
                    const cell = new THREE.Mesh(
                        new THREE.BoxGeometry(cellSize, 0.1, cellSize),
                        new THREE.MeshStandardMaterial({ 
                            color: cellColor,
                            metalness: 0.2,
                            roughness: 0.8
                        })
                    );
                    
                    // Position cell in grid
                    cell.position.set(
                        startX + col * (cellSize + spacing),
                        0.15,
                        startZ + row * (cellSize + spacing)
                    );
                    
                    // Add cell to group
                    periodicTableGroup.add(cell);
                    
                    // Add symbol text for some key elements
                    if ((row === 0 && col === 0) || // H
                        (row === 0 && col === 4) || // He
                        (row === 1 && col === 0) || // Li
                        (row === 2 && col === 0)) { // Na
                        
                        // Create canvas for text
                        const canvas = document.createElement('canvas');
                        canvas.width = 64;
                        canvas.height = 64;
                        const context = canvas.getContext('2d');
                        
                        // Draw background
                        context.fillStyle = '#FFFFFF';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        
                        // Draw text
                        context.font = 'bold 40px Arial';
                        context.fillStyle = '#000000';
                        context.textAlign = 'center';
                        context.textBaseline = 'middle';
                        
                        // Set symbol based on position
                        let symbol = '';
                        if (row === 0 && col === 0) symbol = 'H';
                        else if (row === 0 && col === 4) symbol = 'He';
                        else if (row === 1 && col === 0) symbol = 'Li';
                        else if (row === 2 && col === 0) symbol = 'Na';
                        
                        context.fillText(symbol, canvas.width / 2, canvas.height / 2);
                        
                        // Create texture and material
                        const texture = new THREE.CanvasTexture(canvas);
                        const material = new THREE.MeshBasicMaterial({ map: texture });
                        
                        // Create symbol plane
                        const symbolPlane = new THREE.Mesh(
                            new THREE.PlaneGeometry(cellSize * 0.8, cellSize * 0.8),
                            material
                        );
                        
                        // Position slightly above cell
                        symbolPlane.position.y = 0.06;
                        symbolPlane.rotation.x = -Math.PI / 2;
                        
                        // Add to cell
                        cell.add(symbolPlane);
                    }
                }
            }
            
            // Add a title bar at the top
            const titleBar = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.1, 0.4),
                new THREE.MeshStandardMaterial({ 
                    color: colors.accent,
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            titleBar.position.set(0, 0.25, -0.95);
            periodicTableGroup.add(titleBar);
            
            // Add the group to the scene
            scene.add(periodicTableGroup);
            
            // Store reference for animation
            mesh = periodicTableGroup;
            
            // Add initial animation
            gsap.from(periodicTableGroup.rotation, {
                y: Math.PI * 2,
                duration: 1.5,
                ease: "elastic.out(1, 0.3)"
            });
            
            // Add continuous animation
            gsap.to(periodicTableGroup.rotation, {
                y: Math.PI * 2,
                duration: 15,
                repeat: -1,
                ease: "none"
            });
        }
    };
}