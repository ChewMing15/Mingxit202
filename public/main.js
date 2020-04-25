submit_button.addEventListener('click', () => {

    if('geolocation' in navigator){
        try {
            console.log('Geo Location available');
            navigator.geolocation.getCurrentPosition(async position => {
                const long = position.coords.longitude;
                const lat = position.coords.latitude;
                document.getElementById('long').textContent = long.toFixed(2);
                document.getElementById('lat').textContent = lat.toFixed(2);

                const data = {long, lat};

                const key = `weatherapi/${lat},${long}`
                const weather_resp = await fetch(key);
                const json = await weather_resp.json();
                console.log(json);

                mapper(data);

                const options = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                };

                const response = await fetch('/ctos', options);
                //const input = await response.json();
                
                console.log(response);

            });
        } catch {
            console.log('something is wrong')
        }

    } else {
        console.log("No navigator");
    }

});

function mapper(data) {

    // Specific to Leaflet.js: Making a map and tiles
    const mymap = L.map('mapid').setView([0, 0], 1);

    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const titles = L.tileLayer(tileUrl, { attribution });

    titles.addTo(mymap);
    // end of Specific to Leaflet.js: Making a map and tiles

    // Specific to Leaflet.js: Making a marker with an icon
    const myIcon = L.icon({
        iconUrl: 'iss.png',
        iconSize: [50, 32],
        iconAnchor: [25, 16], //center it at half of iconSize
    });
    // Custom marker
    const marker = L.marker([0, 0], { icon: myIcon }).addTo(mymap);
    // end of Specific to Leaflet.js: Making a marker with an icon

    marker.setLatLng([data.lat, data.long]);

    mymap.setView([data.lat, data.long], 5);

}