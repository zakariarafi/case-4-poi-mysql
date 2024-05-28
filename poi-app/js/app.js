// Initialize the map
const map = L.map('map').setView([-6.2, 106.816666], 13);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load POIs from the server
async function loadPOIs() {
    try {
        const response = await fetch('php/read_poi.php');
        const pois = await response.json();
        pois.forEach(poi => {
            addMarkerToMap(poi);
        });
    } catch (error) {
        console.error('Error loading POIs:', error);
    }
}

// Add a marker to the map
function addMarkerToMap(poi) {
    const marker = L.marker([poi.latitude, poi.longitude], { draggable: true }).addTo(map);
    marker.bindPopup(`<b>${poi.name}</b><br>${poi.description}`);
    marker.on('click', () => showPOIForm(poi));
    marker.on('dragend', async (event) => {
        const { lat, lng } = event.target.getLatLng();
        poi.latitude = lat;
        poi.longitude = lng;
        await updatePOI(poi);
    });
    marker.on('contextmenu', async (event) => {
        event.preventDefault();
        if (confirm('Are you sure you want to delete this POI?')) {
            await deletePOI(poi.id);
            marker.remove();
        }
    });
}

// Show the POI form
function showPOIForm(poi = null) {
    const formTitle = document.getElementById('form-title');
    const poiForm = document.getElementById('poi-form');
    const poiId = document.getElementById('poi-id');
    const poiName = document.getElementById('poi-name');
    const poiDescription = document.getElementById('poi-description');
    const poiAddress = document.getElementById('poi-address');
    const poiCategory = document.getElementById('poi-category');
    const poiRating = document.getElementById('poi-rating');
    const poiImageUrl = document.getElementById('poi-image-url');

    if (poi) {
        formTitle.textContent = 'Update POI';
        poiId.value = poi.id;
        poiName.value = poi.name;
        poiDescription.value = poi.description;
        poiAddress.value = poi.address;
        poiCategory.value = poi.category;
        poiRating.value = poi.rating;
        poiImageUrl.value = poi.image_url;
    } else {
        formTitle.textContent = 'Create POI';
        poiForm.reset();
    }

    document.getElementById('poi-form-container').classList.remove('hidden');
}

// Hide the POI form
function hidePOIForm() {
    document.getElementById('poi-form-container').classList.add('hidden');
}

// Create a new POI
async function createPOI(poi) {
    try {
        const response = await fetch('php/create_poi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(poi)
        });
        const result = await response.text();
        console.log(result);
        addMarkerToMap(poi);
    } catch (error) {
        console.error('Error creating POI:', error);
    }
}

// Update an existing POI
async function updatePOI(poi) {
    try {
        const response = await fetch('php/update_poi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(poi)
        });
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error updating POI:', error);
    }
}

// Delete a POI
async function deletePOI(poiId) {
    try {
        const response = await fetch('php/delete_poi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: poiId })
        });
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error deleting POI:', error);
    }
}

// Handle form submission
document.getElementById('poi-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const poi = {
        id: document.getElementById('poi-id').value,
        name: document.getElementById('poi-name').value,
        description: document.getElementById('poi-description').value,
        address: document.getElementById('poi-address').value,
        category: document.getElementById('poi-category').value,
        rating: document.getElementById('poi-rating').value,
        image_url: document.getElementById('poi-image-url').value,
        latitude: document.getElementById('poi-latitude').value,
        longitude: document.getElementById('poi-longitude').value
    };

    if (poi.id) {
        await updatePOI(poi);
    } else {
        await createPOI(poi);
    }

    hidePOIForm();
});

// Cancel form
document.getElementById('cancel-btn').addEventListener('click', () => {
    hidePOIForm();
});

// Load POIs on page load
loadPOIs();

// Handle map click event
map.on('click', (event) => {
    const { lat, lng } = event.latlng;
    document.getElementById('poi-latitude').value = lat;
    document.getElementById('poi-longitude').value = lng;
    showPOIForm();
});