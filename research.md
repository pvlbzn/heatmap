# Heat Map


## Client Information
Stack: `Django`, `psql`, `Python`.
Libs: `geopy`

Objects are _zip codes_, in amount of 100..15000.

Acceptable solutions: _static_, _interactive_.

Client will use static image as the end result.


## Dynamic View

#### leaflet

[URL](http://leafletjs.com/)

JS library for interactive maps. No heatmap built-in, however it extist
as a module.


#### Google Maps

[URL](https://developers.google.com/maps/documentation/javascript/heatmaplayer)

Google Maps API heatmap layer.


#### heatmap.js

[Heatmap.js](https://www.patrick-wied.at/static/heatmapjs/)

[Google Maps module](https://github.com/pa7/heatmap.js/tree/develop/plugins/gmaps-heatmap)

General purpose heatmapping library. No support of maps out of the box,
but it has modules for Google Maps and Leaflet.



## Static File

#### heatmap.py

[GitHib](https://github.com/jjguy/heatmap)

General purpose heatmap library.


## Static vs Dynamic
I would suggest prefer dynamic view. It has advantages:

* Scalable: adding of new features is not very difficult
* Solid functionality: most of the libraries supports much more features than needed
* User friendly: its interactive

Also, there are not much happening in the world of static heatmaps.


## Library Choice
Google Maps API heatmap layer seems to be a quite a good choice. Why should we
use side library on top of the Google Maps if Google Maps already support _natively_
thing we need.


## Data Protocol
I would suggest to use http://geojson.org/ as a data protocol.
https://tools.ietf.org/html/rfc7946
