$(document).ready(() => {
    const mapboxURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

    const dark = L.tileLayer(mapboxURL, {
        maxZoom: 18,
        minZoom: 1,
        attribution: attribution,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1
    });

    const sat = L.tileLayer(mapboxURL, {
        maxZoom: 18,
        minZoom: 1,
        attribution: attribution,
        id: 'mapbox/satellite-streets-v11',
        tileSize: 512,
        zoomOffset: -1
    });

    const light = L.tileLayer(mapboxURL, {
        maxZoom: 18,
        minZoom: 1,
        attribution: attribution,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1
    });

    const map = L.map('mapid', {
        center: [0, 0],
        worldCopyJump: true,
        zoom: 3,
        scrollWheelZoom: true,
        layers: [dark, sat, light]
    });

    const baseMapLayers = {
        "Dark": dark,
        "Light": light,
        "Satellite": sat
    }
    // Add controls to the map
    L.control.layers(baseMapLayers).addTo(map);

    const issIcon = L.icon({
        iconUrl: './assets/iss2.png',
        iconSize: [51.2, 51.2],
        popupAnchor: [0, -20],
    });

    const iss = L.marker([0, 0], { icon: issIcon }).addTo(map).bindPopup("<b>Hello there!</b>");

    const moveISS = (lat, long) => {
        iss.setLatLng([lat, long]);
        map.panTo([lat, long], animate = true);
    };

    const updateISS = () => {
        $.ajax('https://api.wheretheiss.at/v1/satellites/25544')
            .done(s => {
                let lat = s.latitude;
                let long = s.longitude;
                let t = s.timestamp;
                moveISS(lat, long);
            })
            .fail(e => console.log('error', e));
        setTimeout(updateISS, 8000);            // update ISS position every 8 seconds
    };

    updateISS();
});
