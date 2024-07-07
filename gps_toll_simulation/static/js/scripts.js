let map;
let carMarker;

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([19.0760, 72.8777], 8);  // Center on Mumbai with zoom level 8
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
    console.log("Map initialized");
});

function calculateToll() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    fetch('/calculate_toll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source, destination }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('toll_result').innerText = `Estimated Toll: ₹${data.toll}`;
        document.getElementById('distance_result').innerText = `Distance: ${data.distance} km`;
    });
}

function simulateSpeed() {
    fetch('/simulate_speed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const speedResult = document.getElementById('speed_result');
        speedResult.innerHTML = `
            <p>Speeds: ${data.speeds.join(', ')}</p>
            <p>Average Speed: ${data.average_speed} km/h</p>
            <p>Points Earned: ${data.points}</p>
        `;
    });
}

function getTollBooths() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    fetch('/get_toll_booths', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source, destination }),
    })
    .then(response => response.json())
    .then(data => {
        const tollBooths = data.toll_booths;
        tollBooths.forEach(booth => {
            L.marker([booth.lat, booth.lon]).addTo(map).bindPopup(`Toll Booth: ${booth.name}`);
        });

        // Assuming the route coordinates are received for car animation
        const routeCoords = tollBooths.map(booth => [booth.lat, booth.lon]);
        animateCar(routeCoords);
    });
}

function animateCar(routeCoords) {
    if (carMarker) {
        map.removeLayer(carMarker);
    }
    let i = 0;
    carMarker = L.marker(routeCoords[0], { icon: L.icon({ iconUrl: 'car_icon.png', iconSize: [32, 32] }) }).addTo(map);
    function moveCar() {
        if (i < routeCoords.length - 1) {
            carMarker.setLatLng(routeCoords[i]);
            i++;
            setTimeout(moveCar, 1000);  // Move every 1 second
        }
    }
    moveCar();
}
