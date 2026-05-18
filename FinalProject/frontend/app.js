

// Base API endpoint URL connected to the Node.js backend
const API_URL = 'http://localhost:5000/api/products';

// Initialize event listeners when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); // Initial fetch and render of the line data
    
    // Listen to form submissions on the dispatching console (POST)
    document.getElementById('orderForm').addEventListener('submit', handlePostProduct);
    
    // Manual dashboard refresh button listener
    document.getElementById('refreshBtn').addEventListener('click', fetchProducts);
});

// ========================================================
// 1. Fetch Data & Calculate High-Level Industry KPIs (GET)
// ========================================================
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        
        // Render dynamic WIP tracking cards on the right grid
        renderProducts(products);
        
        // Perform real-time analytics on the dashboard metrics
        calculateKPIs(products);
    } catch (error) {
        console.error("Connection failed to MES backend server:", error);
        document.getElementById('connectionStatus').className = "badge bg-danger";
        document.getElementById('connectionStatus').innerText = "● SERVER OFFLINE";
    }
}

function calculateKPIs(products) {
    const total = products.length;
    document.getElementById('kpiTotal').innerText = total;

    let inspectedCount = 0;
    let qualifiedCount = 0;
    let defectCount = 0;

    products.forEach(p => {
        if (p.inspection && p.inspection.visualInspected) {
            inspectedCount++;
            if (p.inspection.isQualified) {
                qualifiedCount++;
            } else {
                defectCount++;
            }
        }
    });

    // Compute First Pass Yield (FPY) Percentage
    const fpy = inspectedCount > 0 ? ((qualifiedCount / inspectedCount) * 100).toFixed(1) : "0.0";
    document.getElementById('kpiFpy').innerText = `${fpy}%`;
    document.getElementById('kpiDefects').innerText = defectCount;
}

// ========================================================
// 2. Render Backend JSON Array into Cyberpunk Cards
// ========================================================
function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    if (products.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>No active workpieces on line. Please dispatch an order...</p></div>`;
        return;
    }

    container.innerHTML = ''; // Clear previous view

    products.forEach(p => {
        // Evaluate custom border color indicator based on camera QA results
        let cardBorderClass = '';
        if (p.inspection.visualInspected) {
            cardBorderClass = p.inspection.isQualified ? 'border-qualified' : 'border-defective';
        }

        // Parse status lightbulb CSS classes for the 3 key stations
        const machLight = getLightClass(p.stations.machiningStation);
        const assemLight = getLightClass(p.stations.assemblyStation);
        const sortLight = getLightClass(p.stations.sortingStation);

        // Generate customized HTML card markup string
        const cardHtml = `
            <div class="col">
                <div class="card product-card h-100 p-3 text-light ${cardBorderClass}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge bg-dark text-info font-monospace small">${p.productCode}</span>
                            <h5 class="card-title text-white mt-1 mb-0">${p.title}</h5>
                        </div>
                        <button class="btn btn-sm btn-link text-danger p-0" onclick="handleDeleteProduct(${p.id})">🗑️ Scrap</button>
                    </div>
                    <p class="card-text text-muted small mb-3">${p.description}</p>
                    
                    <div class="bg-dark bg-opacity-50 p-2 rounded mb-3 border border-secondary border-opacity-20 font-monospace small">
                        <div class="d-flex justify-content-between mb-1">
                            <span>⚙️ Machining Station:</span>
                            <span><span class="status-dot ${machLight}"></span>${p.stations.machiningStation}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <span>🤖 Assembly Station:</span>
                            <span><span class="status-dot ${assemLight}"></span>${p.stations.assemblyStation}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>👁️ Visual Sorting Station:</span>
                            <span><span class="status-dot ${sortLight}"></span>${p.stations.sortingStation}</span>
                        </div>
                    </div>

                    <div class="small mb-3">
                        <span class="text-muted">Inspection Status:</span> 
                        ${p.inspection.visualInspected ? 
                            `<span class="${p.inspection.isQualified ? 'text-success' : 'text-danger'} font-weight-bold">
                                [${p.inspection.isQualified ? '🟢 PASSED' : '🔴 DEFECT - ' + p.inspection.defectType}] 
                                Value: ${p.inspection.measuredValue}mm
                             </span>` : 
                            `<span class="text-warning">[⚪ UNCHECKED]</span>`
                        }
                    </div>

                    <div class="border-top border-secondary border-opacity-30 pt-2 mt-auto d-flex flex-wrap gap-1">
                        <button class="btn btn-xs btn-outline-warning btn-simulate" onclick="simulateStation('${p.id}', 'machiningStation', 'Completed')">▶ Complete Stn 1</button>
                        <button class="btn btn-xs btn-outline-warning btn-simulate" onclick="simulateStation('${p.id}', 'assemblyStation', 'Completed')">▶ Complete Stn 2</button>
                        <button class="btn btn-xs btn-outline-info btn-simulate" onclick="simulateCameraInspection('${p.id}')">📷 Trigger Camera QA</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function getLightClass(status) {
    if (status === 'Pending') return 'dot-pending';
    if (status === 'Processing') return 'dot-processing';
    if (status === 'Completed') return 'dot-completed';
    return 'dot-pending';
}

// ========================================================
// 3. Dispatch & Input New Orders into Line (POST)
// ========================================================
async function handlePostProduct(e) {
    e.preventDefault();
    const titleInput = document.getElementById('productTitle');
    const descInput = document.getElementById('productDesc');

    const newOrder = {
        title: titleInput.value,
        description: descInput.value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        });

        if (response.ok) {
            titleInput.value = '';
            descInput.value = '';
            fetchProducts(); // Auto-refresh to instantly render the new card
        }
    } catch (error) {
        console.error("Order dispatching failed:", error);
    }
}

// ========================================================
// 4. Sandbox Simulation: Sensor State Routing Changes (PUT)
// ========================================================
async function simulateStation(id, stationName, nextStatus) {
    // Package partial updates to switch station milestones
    const payload = {
        stations: { [stationName]: nextStatus }
    };
    
    // Automatically trigger next workflow state into 'Processing' for realistic presentation
    if(stationName === 'machiningStation') payload.stations.assemblyStation = 'Processing';
    if(stationName === 'assemblyStation') payload.stations.sortingStation = 'Processing';

    await sendUpdate(id, payload);
}

async function simulateCameraInspection(id) {
    // Geometric algorithm modeling: 40.00mm standard, tolerancing offset bounds +-0.05mm
    const randomValue = (39.8 + Math.random() * 0.4).toFixed(2); // Random sizes generated between 39.80 to 40.20
    const measured = parseFloat(randomValue);
    
    let isQualified = true;
    let defectType = 'None';

    // Strict validation check: flags defect categorizations if metric breaches tolerance limits
    if (measured < 39.95 || measured > 40.05) {
        isQualified = false;
        const defects = ['SizeError(Out of Tolerance)', 'Scratch(Surface Marring)', 'Deformation(Edge Warp)'];
        defectType = defects[Math.floor(Math.random() * defects.length)];
    }

    // Assemble comprehensive nested update payload matching the domain service contract
    const payload = {
        stations: { sortingStation: 'Completed' },
        inspection: {
            visualInspected: true,
            measuredValue: measured,
            isQualified: isQualified,
            defectType: defectType
        }
    };

    await sendUpdate(id, payload);
}

async function sendUpdate(id, payload) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            fetchProducts(); // Re-fetch to compute updated FPY yields live!
        }
    } catch (error) {
        console.error("Failed to sync production status routing:", error);
    }
}

// ========================================================
// 5. Scrap and Remove Defective Parts from Routing (DELETE)
// ========================================================
async function handleDeleteProduct(id) {
    if (!confirm("Are you sure you want to scrap this workpiece and remove it from the active routing?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchProducts();
        }
    } catch (error) {
        console.error("Failed to scrap workpiece item:", error);
    }
}
window.handleDeleteProduct = handleDeleteProduct; // Expose to global scope for inline onclick access in generated cardss
window.handlePostProduct = handlePostProduct;
window.simulateStation = simulateStation;              
window.simulateCameraInspection = simulateCameraInspection;




(function initLiveTelemetry() {
    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => console.log("📡 WebSocket connection established for live telemetry!");
    
    socket.onmessage = (event) => {
        if (event.data === 'REFRESH_DASHBOARD') {
            console.log("🔄 Received dashboard refresh signal via WebSocket");
            if (typeof fetchProducts === 'function') {
                fetchProducts(); // Trigger real-time dashboard update on receiving broadcast
            }else if(typeof loadProducts === 'function'){
                loadProducts(); // Fallback for initial data loading if fetchProducts is not defined yet
            }else if(typeof getProducts==='function'){
                getProducts(); // Ultimate fallback to ensure data sync if other methods are not available
            }else{
                console.warn("No valid data fetching method found to refresh dashboard!");
            }

        }
    };
    socket.onclose = () => 
    {
        console.warn("⚠️ WebSocket connection closed. Real-time updates will be unavailable.");
    setTimeout(initLiveTelemetry,3000); // Attempt reconnection every 3 seconds if connection drops
    };
})();

