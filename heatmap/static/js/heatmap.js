/** 
 * Create Heatmap View.
 * 
 * @param {string} apiPath
 */
function createHeatmap(apiPath) {

let path = apiPath ? apiPath : '/api/v1/small';
let geocoder;
let map;

class Marker {
    constructor(address, title, id, zip) {
        this.address = address;
        this.title = title;
        this.id = id;
        this.zip = zip;
    }
}

function createUI() {
    let mapContainer = document.getElementById('mapContainer');
    
    function initHeatmapBtn() {
        let btn = document.getElementById('heatmapBtn');
        btn.addEventListener('click', () => {
            fetchHeatmap();
        });
        return btn;
    }

    function initMarkersBtn() {
        let btn = document.getElementById('markersBtn');
        btn.addEventListener('click', () => {
            fetchMarkers();
        });
        return btn;
    }

    function initMap() {
        let initialPos = {
            // Chicago
            lat: 41.875126,
            lng: -87.684145
        };

        return new google.maps.Map(mapContainer, {
            center: initialPos,
            scrollwheel: true,
            zoom: 4
        });
    }

    function initGeocoder() {
        return new google.maps.Geocoder();
    }

    let hbtn = initHeatmapBtn();
    let mbtn = initMarkersBtn();
    // Global references
    geocoder = initGeocoder();
    map = initMap(mapContainer);

    drawBounds(map);
}

function fetchMarkers() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: path,
        success: (data) => {
            let markers = collectMarkers(data);
            let bag = renderMarkers(markers);
        }
    })
}

function fetchHeatmap() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: path,
        success: (data) => {
            let markers = getHeatmapData(data);
            renderHeatmap(markers);
        }
    })
}

function getHeatmapData(data) {
    return collectMarkers(data);
}

function renderHeatmap(markers) {
    let coord = [];

    markers.forEach((marker) => {
        geocoder.geocode({'address': marker.zip}, (res, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                coord.push(
                    new google.maps.LatLng(
                        res[0].geometry.location.lat(),
                        res[0].geometry.location.lng()
                ));
            } else {
                console.log('ERROR: ' + status);
            }

        })
    })

    let heatmap = new google.maps.visualization.HeatmapLayer({
        data: coord
    });

    heatmap.setMap(map);
}

function collectMarkers(data) {
    let markers = [];

    data.events.forEach((event) => {
        // Common data for each marker
        let addr = event.address;
        let title = event.title;
        let id = event.id;
        
        event.zips.forEach((zip) => {
            markers.push(new Marker(addr, title, id, zip));
        });
    });

    return markers
}

// TODO: Add info windows to markers
// https://developers.google.com/maps/documentation/javascript/infowindows#open
function renderMarkers(markers) {
    let bag = []

    // For each marker
    markers.forEach((marker) => {
        // zip -> {lat, lng}
        geocoder.geocode({'address': marker.zip}, (res, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                // Create new marker at the corresponding {lat, lng} pair 
                let m = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    map: map,
                    position: res[0].geometry.location,
                    title: marker.title
                });
                bag.push(m);
            } else {
                console.log('ERROR: ' + status);
            }
        });
    });

    return bag;
}

function drawBounds(map) {
    // Dummy bound
    var imageBounds = {
        north: 40.773941,
        south: 40.712216,
        east: -74.12544,
        west: -74.22655
    };

    let overlay = new google.maps.GroundOverlay('#292929', imageBounds);
    overlay.setMap(map);
}

createUI();
}