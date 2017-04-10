
/**
 * Create a map.
 *
 * @param {string} apiPath API path
 * @param {string} containerId container ID that the map will be attached to
 * @param {string} kind what kind of data will be rendered. Possible states
 *                      are wrapped into DataKind object.
 *                      - DataKind.RENDER_LEADS  to render leads
 *                      - DataKind.RENDER_EVENTS to render events
 *                      - DataKind.RENDER_EMPTY  to render neither leads nor events
 * @param {{lat: float, lng: float}} initialRegion initial coordinates that
 *                      the map is centered on.
 * @param {bool} isPolitical renders a political map if this is set to true
 *                      and a geographical map otherwise. Supporting enum-like
 *                      object MapKind with the following possible states:
 *                      - MapKind.POLITICAL
 *                      - MapKind.CLASSIC
 * @param {bool} showHeatmap renders the heatmap if set to true. Supporting
 *                      enum-like object MapKind with the bollowing possible states:
 *                      - MapKind.HEATMAP
 *                      - MapKind.NO_HEATMAP
 * @param {bool} showMarkers renders markers if set to true. Supporting enum-like
 *                      object MapKind with the bollowing possible states:
 *                      - MapKind.MARKERS
 *                      - MapKind.NO_MARKERS
 */
function generateMap(apiPath,
                   containerId,
                   kind=DataKind.RENDER_EMPTY,
                   initialRegion={lat: 39.50, lng: -98.35},
                   isPolitical=MapKind.POLITICAL,
                   showHeatmap=MapKind.HEATMAP,
                   showMarkers=MapKind.MARKERS) {

    /**
     * A class representing Marker data.
     *
     * Not to be confused with google.maps.Marker
     *
     * @class Marker
     */
    class Marker {
        constructor(address, title, id, loc) {
            this.address = address;
            this.title = title;
            this.id = id;
            this.loc = loc;
        }
    }

    /**
     * Create interface
     */
    function createUI() {
        let mapContainer = document.getElementById(containerId);

        // Set container height
        mapContainer.style.height = '100%';

        function initMap() {

            let style = [];

            if (isPolitical) {
                style = [{
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#f5f5f5"
                        }]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#616161"
                        }]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#f5f5f5"
                        }]
                    }, {
                        "featureType": "administrative.neighborhood",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    }, {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    }, {
                        "featureType": "administrative.locality",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "administrative.country",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#bdbdbd"
                        }]
                    },
                    {
                        "featureType": "administrative.province",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                                "color": "#8d8d8d"
                            },
                            {
                                "visibility": "on"
                            },
                            {
                                "weight": 1.5
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#eeeeee"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#757575"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#e5e5e5"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#ffffff"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#757575"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#dadada"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#616161"
                        }]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    },
                    {
                        "featureType": "transit",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#e5e5e5"
                        }]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#eeeeee"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#c9c9c9"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    }
                ]
            } else {
                style = '';
            }

            return new google.maps.Map(mapContainer, {
                center: initialRegion,
                scrollwheel: true,
                zoom: 5,
                styles: style
            });
        }

        return initMap();
    }

    function fetch(path, callback) {
        $.ajax({
            type: "GET",
            url: path,
            success: callback
        });
    }

    function collectMarkers(data) {
        let markers = [];

        data.events.forEach((event) => {
            let pureLocations = dataSentinel(event.locations);

            pureLocations.forEach(location => {
                markers.push(new Marker(
                    event.address,
                    event.title,
                    event.id,
                    location));
            });
        });

        return markers;
    }

    function renderMarkers(markers) {
        markers.forEach(marker => {
            let m = new google.maps.Marker({
                // Performance issue on a big dataset
                // animation: google.maps.Animation.DROP,
                map: map,
                position: marker.loc,
                title: marker.title
            });

            // Block uses `this` pointer
            google.maps.event.addListener(m, 'click', function () {
                let info = new google.maps.InfoWindow();
                info.setContent(
                    '<b>Address:</b> ' + marker.address + '<br>' +
                    '<b>Title:</b> ' + marker.title + '<br>' +
                    '<b>ID:</b> ' + marker.id + '<br>');
                info.open(map, this);
            });
        });
    }

    function renderHeatmap(markers) {
        let coord = [];

        markers.forEach(marker => {
            coord.push(
                new google.maps.LatLng(marker.loc)
            );
        });

        let heatmap = new google.maps.visualization.HeatmapLayer({
            data: coord,
            map: map,
            radius: 45,
            maxIntensity: 10
        });
    }

    /**
     * Render Event marker on a map.
     * 
     * Function works a little different from renderHeatmap or renderMarkers.
     * Those two take a list of Marker objects, while renderEvent takes
     * an address and a title as arguments and renders them directly avoiding
     * object serialization.
     * 
     * @param {string} addr event address in a human readable string
     * @param {string} title event title
    
     */
    function renderEvent(addr, title) {
        geocoder.geocode({'address': addr}, (res, status) => {
            if (status == 'OK') {
                let m = new google.maps.Marker({
                    map: map,
                    position: res[0].geometry.location,
                    titile: title
                });

                // Block uses `this` pointer
                google.maps.event.addListener(m, 'click', function () {
                    let info = new google.maps.InfoWindow();
                    info.setContent(
                        '<b>Address:</b> ' + addr + '<br>' +
                        '<b>Title:</b> ' + title + '<br>');
                    info.open(map, this);
                });
            } else {
                console.error('Geocode failure');
            }
        });
    }

    /**
     * Data sentinel ensures data consistency by filtering out points that are not located in the US.
     *
     * Source: http://answers.google.com/answers/threadview?id=149284
     */
    function dataSentinel(data) {
        let north_lat = 49.3457868; // top
        let west_lng  = -124.7844079; // left
        let east_lng  = -66.9513812; // right
        let south_lat = 24.7433195; // bottom

        let clean = data.filter(point =>
            south_lat <= point.lat &&
            point.lat <= north_lat &&
            west_lng  <= point.lng &&
            point.lng <= east_lng);

        return clean;
    }

    function renderUI(kind) {
        switch (kind) {
            case 'RENDER_LEADS':
                if (showHeatmap && showMarkers) {
                    fetch(apiPath, data => {
                        let parsedData = JSON.parse(data);
                        let markers = collectMarkers(parsedData);
                        renderHeatmap(markers);
                        renderMarkers(markers);
                    });

                } else if (showHeatmap) {
                    fetch(apiPath, data => {
                        let parsedData = JSON.parse(data);
                        let markers = collectMarkers(parsedData);
                        renderHeatmap(markers);
                    });
                    
                } else if (showMarkers) {
                    fetch(apiPath, data => {
                        let parsedData = JSON.parse(data);
                        let markers = collectMarkers(parsedData);
                        renderMarkers(markers);
                    });
                }
            break;

            case 'RENDER_EVENTS':
                fetch(apiPath, data => {
                    let parsedData = JSON.parse(data);
                    
                    parsedData.events.forEach(event => {
                        renderEvent(event.address, event.title);
                    });

                    if (showHeatmap) {
                        let markers = collectMarkers(parsedData);
                        renderHeatmap(markers);
                    }

                    if (showMarkers) {
                        console.error('Kind.RENDER_EVENTS and showMarkers=true at the same time, it shouldnt be so');
                    }
                })
            break;

            case '':
                // Do nothing, just check function call consistency
            break;

            default:
                console.error('kind paramenter must be provided to the generateMap function');
        }
    }

    const map = createUI();
    const geocoder = new google.maps.Geocoder();
    renderUI(kind);
}

const DataKind = {
    'RENDER_LEADS': 'RENDER_LEADS',
    'RENDER_EVENTS': 'RENDER_EVENTS',
    'RENDER_EMPTY': ''
}

const MapKind = {
    'POLITICAL': true,
    'CLASSIC': false,
    'HEATMAP': true,
    'NO_HEATMAP': false,
    'MARKERS': true,
    'NO_MARKERS': false
}
