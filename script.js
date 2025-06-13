const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvmMq8a_cX4QEyn8Tn16Wkh9RyIDZymJsFYjiVh_eoaHvEs9GmDtzkfsVRDs5xUzUf/exec';

// Funciones de navegación
function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    document.getElementById(screenId).classList.add('active');
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Función para enviar datos a Google Sheets
async function sendToGoogleSheets(data) {
    try {
        showLoading();
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showScreen('success');
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el reporte. Por favor, intenta nuevamente.');
    } finally {
        hideLoading();
    }
}

// Configurar formularios
document.getElementById('fuelForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        type: 'Combustible',
        driver: document.getElementById('fuelDriver').value,
        plate: document.getElementById('fuelPlate').value.toUpperCase(),
        mileage: document.getElementById('fuelMileage').value,
        liters: document.getElementById('fuelLiters').value,
        amount: document.getElementById('fuelAmount').value
    };
    
    sendToGoogleSheets(data);
    this.reset();
});

document.getElementById('dayendForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        type: 'Fin de día',
        driver: document.getElementById('dayendDriver').value,
        plate: document.getElementById('dayendPlate').value.toUpperCase(),
        endMileage: document.getElementById('dayendMileage').value,
        observations: document.getElementById('dayendObservations').value
    };
    
    sendToGoogleSheets(data);
    this.reset();
});

document.getElementById('incidentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        type: 'Incidente',
        driver: document.getElementById('incidentDriver').value,
        plate: document.getElementById('incidentPlate').value.toUpperCase(),
        incident: document.getElementById('incidentDescription').value
    };
    
    sendToGoogleSheets(data);
    this.reset();
});

// PWA: Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js');
    });
}
