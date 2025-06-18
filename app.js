// Miro App for Object Shuffler
let selectedObjects = [];
let isShuffling = false;

// Initialize the app
async function init() {
    console.log('Object Shuffler app initializing...');
    
    try {
        // Check if we're running inside Miro
        if (typeof miro === 'undefined') {
            console.log('Running outside Miro - demo mode');
            setupDemoMode();
            return;
        }
        
        await miro.ready();
        console.log('Miro SDK ready');

          // 👉 this line forces app to open in sidebar
  await miro.board.ui.openPanel({ url: 'index.html' });
        
        // Set up event listeners
        setupEventListeners();
        
        // Start monitoring selection changes
        monitorSelection();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showStatus('Failed to initialize app', 'error');
    }
}

// Setup demo mode when running outside Miro
function setupDemoMode() {
    const selectionCount = document.getElementById('selectionCount');
    const shuffleButton = document.getElementById('shuffleButton');
    const buttonText = document.getElementById('buttonText');
    
    // Show demo message
    selectionCount.textContent = 'Demo';
    buttonText.textContent = 'Demo Mode - Install in Miro to use';
    shuffleButton.disabled = true;
    
    showStatus('This is a demo. Install the app in Miro to use it.', 'error');
    
    // Add installation instructions
    const content = document.querySelector('.content');
    const demoInstructions = document.createElement('div');
    demoInstructions.innerHTML = `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 16px; margin-top: 20px;">
            <h4 style="color: #856404; margin-bottom: 12px;">Installation Required</h4>
            <p style="color: #856404; font-size: 14px; line-height: 1.4;">
                To use this app, you need to install it in Miro first:<br><br>
                1. Go to <a href="https://developers.miro.com" target="_blank" style="color: #0099ff;">developers.miro.com</a><br>
                2. Create a new app<br>
                3. Use this URL: <code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px;">${window.location.href}</code><br>
                4. Set scopes: boards:read, boards:write<br>
                5. Install in your Miro board
            </p>
        </div>
    `;
    content.appendChild(demoInstructions);
}

// Set up event listeners
function setupEventListeners() {
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', handleShuffle);
}

// Monitor selection changes
async function monitorSelection() {
    try {
        // Listen for selection changes
        miro.board.ui.on('selection:update', async (event) => {
            selectedObjects = event.items;
            updateUI();
        });
        
        // Get initial selection
        selectedObjects = await miro.board.getSelection();
        updateUI();
        
    } catch (error) {
        console.error('Error monitoring selection:', error);
    }
}

// Update UI based on current selection
function updateUI() {
    const selectionCount = document.getElementById('selectionCount');
    const shuffleButton = document.getElementById('shuffleButton');
    const buttonText = document.getElementById('buttonText');
    
    const count = selectedObjects.length;
    selectionCount.textContent = count;
    
    if (count >= 2) {
        shuffleButton.disabled = false;
        buttonText.textContent = `Shuffle ${count} objects`;
        shuffleButton.style.background = '#0099ff';
    } else {
        shuffleButton.disabled = true;
        buttonText.textContent = count === 1 ? 'Select one more object' : 'Select objects to shuffle';
        shuffleButton.style.background = '#ccc';
    }
}

// Handle shuffle button click
async function handleShuffle() {
    if (isShuffling || selectedObjects.length < 2) {
        return;
    }
    
    isShuffling = true;
    updateButtonState(true);
    
    try {
        const result = await shuffleObjects(selectedObjects);
        
        if (result.success) {
            showStatus(`Successfully shuffled ${result.count} objects!`, 'success');
        } else {
            showStatus(result.message || 'Shuffle failed', 'error');
        }
        
    } catch (error) {
        console.error('Shuffle error:', error);
        showStatus('An error occurred while shuffling', 'error');
    } finally {
        isShuffling = false;
        updateButtonState(false);
    }
}

// Update button state during shuffling
function updateButtonState(loading) {
    const shuffleButton = document.getElementById('shuffleButton');
    const buttonText = document.getElementById('buttonText');
    
    if (loading) {
        shuffleButton.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Shuffling...</span>
        `;
        shuffleButton.disabled = true;
    } else {
        shuffleButton.innerHTML = `
            <svg class="shuffle-icon" viewBox="0 0 24 24">
                <path d="M14,20A2,2 0 0,1 12,18A2,2 0 0,1 14,16H16V14L20,17L16,20M10,4A2,2 0 0,1 12,6A2,2 0 0,1 10,8H8V10L4,7L8,4M16.5,12A2.5,2.5 0 0,0 14,9.5H10A2.5,2.5 0 0,0 7.5,12A2.5,2.5 0 0,0 10,14.5H14A2.5,2.5 0 0,0 16.5,12Z"/>
            </svg>
            <span id="buttonText">Shuffle ${selectedObjects.length} objects</span>
        `;
        updateUI(); // Restore proper button state
    }
}

// Main shuffle function
async function shuffleObjects(objects) {
    try {
        console.log(`Starting shuffle of ${objects.length} objects`);
        
        // Get object properties
        const objectProps = objects.map(obj => getObjectProperties(obj));
        
        // Calculate shuffle area
        const shuffleArea = calculateShuffleArea(objectProps);
        
        // Generate new positions
        const newPositions = generateShuffledPositions(objectProps, shuffleArea);
        
        // Validate positions
        const validatedPositions = validatePositions(newPositions, objectProps, shuffleArea);
        
        // Update object positions
        const updates = objects.map((obj, index) => ({
            id: obj.id,
            x: validatedPositions[index].x,
            y: validatedPositions[index].y
        }));
        
        await miro.board.widgets.update(updates);
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Shuffle completed successfully');
        return { success: true, count: objects.length };
        
    } catch (error) {
        console.error('Shuffle operation failed:', error);
        return { success: false, message: 'Failed to shuffle objects' };
    }
}

// Get object properties including position and dimensions
function getObjectProperties(obj) {
    return {
        id: obj.id,
        type: obj.type,
        x: obj.x || 0,
        y: obj.y || 0,
        width: obj.width || 100,
        height: obj.height || 100,
        bounds: {
            left: (obj.x || 0) - (obj.width || 100) / 2,
            right: (obj.x || 0) + (obj.width || 100) / 2,
            top: (obj.y || 0) - (obj.height || 100) / 2,
            bottom: (obj.y || 0) + (obj.height || 100) / 2
        }
    };
}

// Calculate the area where objects should be shuffled
function calculateShuffleArea(objects) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    objects.forEach(obj => {
        minX = Math.min(minX, obj.bounds.left);
        maxX = Math.max(maxX, obj.bounds.right);
        minY = Math.min(minY, obj.bounds.top);
        maxY = Math.max(maxY, obj.bounds.bottom);
    });
    
    // Add padding around the area
    const padding = 200;
    return {
        minX: minX - padding,
        maxX: maxX + padding,
        minY: minY - padding,
        maxY: maxY + padding
    };
}

// Generate random positions for objects
function generateShuffledPositions(objects, shuffleArea) {
    const positions = [];
    const maxAttempts = 100;
    
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        let attempts = 0;
        let newPosition;
        
        do {
            const x = Math.random() * (shuffleArea.maxX - shuffleArea.minX - obj.width) + 
                      shuffleArea.minX + obj.width / 2;
            const y = Math.random() * (shuffleArea.maxY - shuffleArea.minY - obj.height) + 
                      shuffleArea.minY + obj.height / 2;
            
            newPosition = { x, y };
            attempts++;
            
            // Check for collisions
            const hasCollision = positions.some((pos, index) => 
                checkCollision(newPosition, obj, pos, objects[index])
            );
            
            if (!hasCollision || attempts >= maxAttempts) {
                break;
            }
        } while (attempts < maxAttempts);
        
        positions.push(newPosition);
    }
    
    return positions;
}

// Check if two objects would collide
function checkCollision(pos1, obj1, pos2, obj2) {
    const margin = 50; // Minimum distance between objects
    
    const bounds1 = {
        left: pos1.x - obj1.width / 2 - margin,
        right: pos1.x + obj1.width / 2 + margin,
        top: pos1.y - obj1.height / 2 - margin,
        bottom: pos1.y + obj1.height / 2 + margin
    };
    
    const bounds2 = {
        left: pos2.x - obj2.width / 2,
        right: pos2.x + obj2.width / 2,
        top: pos2.y - obj2.height / 2,
        bottom: pos2.y + obj2.height / 2
    };
    
    return !(bounds1.right < bounds2.left || 
             bounds1.left > bounds2.right || 
             bounds1.bottom < bounds2.top || 
             bounds1.top > bounds2.bottom);
}

// Validate and adjust positions
function validatePositions(positions, objects, shuffleArea) {
    return positions.map((pos, index) => {
        const obj = objects[index];
        
        const x = Math.max(
            shuffleArea.minX + obj.width / 2,
            Math.min(shuffleArea.maxX - obj.width / 2, pos.x)
        );
        
        const y = Math.max(
            shuffleArea.minY + obj.height / 2,
            Math.min(shuffleArea.maxY - obj.height / 2, pos.y)
        );
        
        return { x, y };
    });
}

// Show status message
function showStatus(message, type = 'success') {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 3000);
}

// Initialize the app when the page loads
init();
