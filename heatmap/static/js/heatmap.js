
/**
 * Create a Heatmap
 * 
 * @param {string} apiPath 
 * @param {{lat: float, lng: float}} initialRegion initial region is the region
 *          where map will aim by default. 
 * @param {bool} isPolitical true by default, will render "political" style,
 *          normal map otherwise.
 */
function createHeatmap(apiPath, initialRegion, isPolitical) {
    let political = true;
    if (isPolitical == false) political = false;
    
    // If path is given, use it. Otherwise API path can be hardcoded here
    let path = apiPath ? apiPath : '/api/v1/small';
    let region = initialRegion ? initialRegion : {
        lat: 36.778261,
        lng: -119.41793239999998
    };
    let geocoder;
    let map;

    // Collection of marker objects which are rendered on map view
    let markerBag = [];


    /**
     * Marker class represents Marker datastructure which contains
     * information about marker.
     * 
     * Note: do not confuse with google.maps.Marker
     * 
     * @class Marker
     */
    class Marker {
        constructor(address, title, id, zip) {
            this.address = address;
            this.title = title;
            this.id = id;
            this.zip = zip;
        }
    }

    /**
     * Create interface 
     */
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

        function initGeocoder() {
            return new google.maps.Geocoder();
        }

        function initMap() {

            let style = [];

            if (political) {
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
                center: region,
                scrollwheel: true,
                zoom: 7,
                styles: style
            });
        }

        let hbtn = initHeatmapBtn();
        let mbtn = initMarkersBtn();

        // Global references
        geocoder = initGeocoder();
        map = initMap(mapContainer);
    }

    /*
    function nameToGeopoint(name) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': name
        }, (res, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                let point = {
                    lat: res[0].geometry.location.lat(),
                    lng: res[0].geometry.location.lng()
                };
                console.log(point);
                return point;
            } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                // Over query event
                console.error(status);
            } else {
                console.error('ERROR: ' + status);
            }
        })
    }
    */

    // Improvement: if data already fetched, no reason to fetch it again
    function fetchMarkers() {
        $.ajax({
            type: "GET",
            url: path,
            success: (data) => {
                let parsedData = JSON.parse(data);
                let markers = collectMarkers(parsedData);
                let bag = createMarkers(markers);
            }
        })
    }

    function fetchHeatmap() {
        $.ajax({
            type: "GET",
            url: path,
            success: (data) => {
                let parsedData = JSON.parse(data);
                let markers = collectMarkers(parsedData);
                let bag = renderHeatmap(markers);
            }
        })
    }

    function collectMarkers(data) {
        let markers = [];

        data.events.forEach((event) => {
            let pureLocations = dataSentinel(event.locations);

            pureLocations.forEach((location) => {
                markers.push(new Marker(
                    event.address,
                    event.title,
                    event.id,
                    location));
            });
        });

        return markers;
    }

    function createMarkers(markers) {
        // Global variable, stores google.maps.Marker objects
        markerBag = []

        markers.forEach((marker) => {
            let m = new google.maps.Marker({
                // Performance issue on a big dataset
                // animation: google.maps.Animation.DROP,
                map: map,
                position: marker.zip,
                title: marker.title
            });

            markerBag.push(m);

            google.maps.event.addListener(m, 'click', function () {
                let info = new google.maps.InfoWindow();
                info.setContent(
                    '<b>Address:</b> ' + marker.address + '<br>' +
                    '<b>Title:</b> ' + marker.title + '<br>' +
                    '<b>ID:</b> ' + marker.id + '<br>');
                info.open(map, this);
            });

        })
    }

    function renderHeatmap(markers) {
        let coord = [];

        markers.forEach((marker) => {
            coord.push(
                new google.maps.LatLng(marker.zip)
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
     * Data sentinel secures data consistency
     * 
     * Filter out data which is not belong to US from the dataset.
     * 
     * Feature: We can cut data by states in this fashion
     *      http://answers.google.com/answers/threadview?id=149284
     */
    function dataSentinel(data) {
        let north_lat = 49.3457868; // top
        let west_lng = -124.7844079; // left
        let east_lng = -66.9513812; // right
        let south_lat = 24.7433195; // bottom

        let clean = data.filter(point =>
            south_lat <= point.lat &&
            point.lat <= north_lat &&
            west_lng <= point.lng &&
            point.lng <= east_lng);

        return clean;
    }

    createUI();
}