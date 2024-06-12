// Initialize the map
let lastMarker = null;
const map = L.map("map").setView([-6.2, 106.816666], 13);
const markerGroup = L.layerGroup().addTo(map);

// Add the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Add a marker to the map
function addMarkerToMap({ latitude, longitude, poi = null }) {
  if (!((latitude && longitude) || poi)) return;

  const marker = L.marker([poi.latitude, poi.longitude], {
    draggable: true,
  }).addTo(markerGroup);

  if (poi) marker.bindPopup(`<b>${poi.name}</b><br>${poi.description}`);
  marker.on("click", () => showPOIForm(poi));
  marker.on("dragend", async (event) => {
    const { lat, lng } = event.target.getLatLng();

    await updatePOI({ ...poi, latitude: lat, longitude: lng });
  });
  marker.on("contextmenu", async (event) => {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this POI?")) {
      await deletePOI(poi.id);
      marker.remove();
    }
  });
}
function fetchPOIs() {
  const tableBody = document.getElementById("poi-table-body");
  tableBody.innerHTML = `
    <tr>
      <td colspan="9" class="text-center py-5">Loading</td>
    </tr>
  `;

  fetch("php/read_poi.php", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) => {
      tableBody.innerHTML = "";
      
      if (res.success) {
        markerGroup.clearLayers();

        if (res?.data?.length > 0) {
          res.data.forEach((poi) => {
            addMarkerToMap({ poi });

            const row = document.createElement("tr");
            row.innerHTML = `
                  <td>${poi.id}</td>
                  <td>${poi.name}</td>
                  <td>${poi.description}</td>
                  <td>${poi.address}</td>
                  <td>${poi.category}</td>
                  <td>${poi.rating}</td>
                  <td>${poi.image_url}</td>
                  <td>${poi.latitude}</td>
                  <td>${poi.longitude}</td>
              `;
            tableBody.appendChild(row);
          });
        } else {
          tableBody.innerHTML = `
            <tr>
              <td colspan="9" class="text-center py-5">Data Empty</td>
            </tr>
          `;
        }
      } else {
        tableBody.innerHTML = `
          <tr>
            <td colspan="9" class="text-center py-5">Data not found</td>
          </tr>
        `;
        throw new Error(res.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to fetch POIs: " + error);
    });
}
// Show the POI form
function showPOIForm(poi = null) {
  const formTitle = document.getElementById("form-title");
  const poiForm = document.getElementById("poi-form");
  const poiId = document.getElementById("poi-id");
  const poiName = document.getElementById("poi-name");
  const poiDescription = document.getElementById("poi-description");
  const poiAddress = document.getElementById("poi-address");
  const poiCategory = document.getElementById("poi-category");
  const poiRating = document.getElementById("poi-rating");
  const poiImageUrl = document.getElementById("poi-image-url");
  const poiLat = document.getElementById("poi-latitude");
  const poiLng = document.getElementById("poi-longitude");
  const deleteAction = document.getElementById("delete-action");

  if (poi) {
    formTitle.textContent = "Update POI";
    poiId.value = poi.id;
    poiName.value = poi.name;
    poiDescription.value = poi.description;
    poiAddress.value = poi.address;
    poiCategory.value = poi.category;
    poiRating.value = poi.rating;
    poiImageUrl.value = poi.image_url;
    poiLat.value = poi.latitude;
    poiLng.value = poi.longitude;

    // append delete button
    deleteAction.innerHTML = `
      <button class="btn btn-danger" onclick="deletePOI(${poi.id})">Delete</button>
    `;

    if (lastMarker) {
      map.removeLayer(lastMarker); // Remove the last marker
    }
  } else {
    formTitle.textContent = "Create POI";
    deleteAction.innerHTML = "";
    poiId.value = null;
    poiForm.reset();
  }

  document.getElementById("poi-form-container").classList.remove("hidden");
}

// Hide the POI form
function hidePOIForm() {
  document.getElementById("poi-form-container").classList.add("hidden");
  if (lastMarker) {
    map.removeLayer(lastMarker); // Remove the last marker
  }
}

// Create a new POI
async function createPOI(poi) {
  fetch("php/create_poi.php", {
    method: "POST",
    body: JSON.stringify(poi),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        hidePOIForm();
        alert("Success insert data!");
        fetchPOIs();
        if (lastMarker) {
          map.removeLayer(lastMarker); // Remove the last marker
        }
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}

// Update an existing POI
async function updatePOI(poi, source = "drag") {
  fetch("php/update_poi.php", {
    method: "PUT",
    body: JSON.stringify(poi),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        if (source === "form") {
          alert(`Updated ${poi.name} data!`);
          hidePOIForm();
        } else {
          alert(`Updated coordinate for ${poi.name} data!`);
        }
        fetchPOIs();
        if (lastMarker) {
          map.removeLayer(lastMarker); // Remove the last marker
        }
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}

// Delete a POI
async function deletePOI(poiId) {
  fetch("php/delete_poi.php", {
    method: "PUT",
    body: JSON.stringify({ id: poiId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("POI Deleted");
        fetchPOIs();
        hidePOIForm();
        if (lastMarker) {
          map.removeLayer(lastMarker); // Remove the last marker
        }
      } else {
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}

// Handle form submission
document
  .getElementById("poi-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const poi = {
      id: document.getElementById("poi-id").value,
      name: document.getElementById("poi-name").value,
      description: document.getElementById("poi-description").value,
      address: document.getElementById("poi-address").value,
      category: document.getElementById("poi-category").value,
      rating: document.getElementById("poi-rating").value,
      image_url: document.getElementById("poi-image-url").value,
      latitude: document.getElementById("poi-latitude").value,
      longitude: document.getElementById("poi-longitude").value,
    };

    if (poi.id) {
      await updatePOI(poi, "form");
    } else {
      await createPOI(poi);
    }
  });

// Cancel form
document.getElementById("cancel-btn").addEventListener("click", () => {
  hidePOIForm();
});

// Load POIs on page load
fetchPOIs();

// Handle map click event
map.on("click", (event) => {
  const { lat, lng } = event.latlng;

  showPOIForm();
  document.getElementById("poi-latitude").value = lat;
  document.getElementById("poi-longitude").value = lng;

  if (lastMarker) {
    map.removeLayer(lastMarker); // Remove the last marker
  }

  const marker = new L.marker(event.latlng).addTo(markerGroup);

  lastMarker = marker;
});
