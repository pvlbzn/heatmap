# Heatmap

## Usage

Dependencies: `flask`, `geopy`

Installation: `pip3 install flask geopy`

Run server:

```
python3 server.py
```

Open the browser at address http://127.0.0.1:5000/


## UI

_Markers_, triggered by _Fetch Markers_ button

![markers](https://github.com/pvlbzn/client_showcase/raw/master/heatmap/ui/markers.png)

_Heatmap_, triggered by _Fetch Heatmap_ button

![heatmap](https://github.com/pvlbzn/client_showcase/blob/master/heatmap/ui/heatmap.png)

_Both_
![both](https://github.com/pvlbzn/client_showcase/raw/master/heatmap/ui/heatmap_markers.png)


## Architecture

*Backend*: Flask

*Frontend*: Google Maps, Google Maps Visualization, jQuery

When you press one of the fetch buttons, frontend makes call to the backend API
`/api/v1/small`. _Flask_ returns the client data, from the file `events/small_event.json`.

Zipcodes from event are converted to the geopoints `(zip:int -> {lat:float, lnt:float})`
which is *bottleneck* of the current solution, because queries has a _query limit_ 
which easily can be reached.

Solution: make server side API function which will convert zip to geopoint.


## TODO

* refactoring
    * separate view and logic
    * DRY
    * logic refactoring
    * comment
    * remove jQuery dependency to native JS AJAX calls (?)
* move control buttons on the map
* custom view on markers
* over query limit workaround
* add remove heatmap option
* add remove markers option
