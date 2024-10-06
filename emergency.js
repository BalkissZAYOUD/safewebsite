let map;
let userMarker;

// Static locations to add to the map
const staticLocations = [
    { name: "Centre d’écoute et d'orientation des femmes victimes de violence - ATFD", lat: 36.816, lon: 10.178 },
    { name: "Association Tunisienne des Femmes Démocrates Siège", lat: 36.799, lon: 10.178 },
    { name: "UN Women and International Rescue Committee (IRC)", lat: 36.847, lon: 10.273 }
];

// Initialize the map using Leaflet.js
function initMap() {
    map = L.map('map').setView([36.8183, 10.1659], 13); // Default center in Tunis

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    // Add static markers to the map
    addStaticLocationsToMap();
}

// Add static locations as markers on the map
function addStaticLocationsToMap() {
    staticLocations.forEach(location => {
        L.marker([location.lat, location.lon]).addTo(map)
            .bindPopup(location.name);
    });
}

document.addEventListener('DOMContentLoaded', initMap);

// OpenStreetMap Nominatim API to fetch nearby emergency services
function fetchEmergencyLocations(lat, lon) {
    const urls = [
        `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="police"](around:5000,${lat},${lon});out;`,
        `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](around:5000,${lat},${lon});out;`
    ];

    Promise.all(urls.map(url => fetch(url).then(response => response.json())))
        .then(dataArray => {
            // Extract locations from the responses
            const locations = dataArray.flatMap(data => 
                data.elements.map(item => ({
                    name: item.tags.name || 'Unnamed Location',
                    latitude: item.lat,
                    longitude: item.lon
                }))
            );

            // Remove duplicates by name
            const uniqueLocations = [...new Map(locations.map(loc => [loc.name, loc])).values()];

            if (uniqueLocations.length > 0) {
                showEmergencyLocations(uniqueLocations, lat, lon);
            } else {
                alert("No emergency services found nearby.");
            }
        })
        .catch(err => {
            console.error('Error fetching emergency locations:', err);
        });
}

// High-accuracy geolocation and fetching emergency locations
function getUserLocation() {
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block'; // Show loading

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,  // Request high accuracy
            timeout: 10000,  // 10 seconds timeout
            maximumAge: 0  // Avoid using cached data
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    document.getElementById('loading').style.display = 'none'; // Hide loading

    // Update the map center to user's location
    map.setView([latitude, longitude], 13);

    // Add a marker for the user's location
    if (userMarker) {
        map.removeLayer(userMarker); // Remove previous marker if any
    }
    userMarker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Your Location')
        .openPopup();

    // Fetch nearby emergency locations based on user position
    fetchEmergencyLocations(latitude, longitude);
}

function showError(error) {
    document.getElementById('loading').style.display = 'none'; // Hide loading
    alert("Unable to retrieve your location. Please ensure location services are enabled.");

    // Optionally set a default location in case of error
    const defaultLat = 36.8183; // Default latitude (Tunis)
    const defaultLon = 10.1659;  // Default longitude (Tunis)
    map.setView([defaultLat, defaultLon], 13); // Center map on default location

    if (userMarker) {
        map.removeLayer(userMarker); // Remove previous marker if any
    }
    userMarker = L.marker([defaultLat, defaultLon]).addTo(map)
        .bindPopup('Default Location (Tunis)')
        .openPopup();

    // Optionally, you could still fetch emergency locations based on default location
    fetchEmergencyLocations(defaultLat, defaultLon);
}

// Show emergency locations and add markers on the map
function showEmergencyLocations(locations, userLat, userLng) {
    const emergencyLocationsDiv = document.getElementById('emergencyLocations');
    emergencyLocationsDiv.innerHTML = '';

    locations.forEach(location => {
        const locationDiv = document.createElement('div');
        locationDiv.innerHTML = `<strong>${location.name}</strong>`;
        emergencyLocationsDiv.appendChild(locationDiv);

        // Add marker to the map
        const marker = L.marker([location.latitude, location.longitude]).addTo(map)
            .bindPopup(location.name);

        // Add direction link
        const directionLink = document.createElement('a');
        directionLink.href = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLat},${userLng};${location.latitude},${location.longitude}`;
        directionLink.textContent = 'Get Directions';
        directionLink.target = '_blank';
        locationDiv.appendChild(directionLink);
    });
}

// Emergency button listener to fetch user location and nearby services
document.getElementById('emergencyButton').addEventListener('click', () => {
    getUserLocation();
});
