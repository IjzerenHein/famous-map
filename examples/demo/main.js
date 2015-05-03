/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014/2015
 */

/*global define, google, L, ol*/
define(function(require) {
    'use strict';

    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');
    var MapView = require('famous-map/MapView');
    var MapModifier = require('famous-map/MapModifier');
    var MapStateModifier = require('famous-map/MapStateModifier');
    var MapUtility = require('famous-map/MapUtility');

    // Enable these in order to test famous-map-global.js
    /*var Engine = window.famous.core.Engine;
    var Modifier = window.famous.core.Modifier;
    var Surface = window.famous.core.Surface;
    var ImageSurface = window.famous.surfaces.ImageSurface;
    var Transform = window.famous.core.Transform;
    var Easing = window.famous.transitions.Easing;
    var MapView = window.famousmap.MapView;
    var MapModifier = window.famousmap.MapModifier;
    var MapStateModifier = window.famousmap.MapStateModifier;
    var MapUtility = window.famousmap.MapUtility;*/

    // create the main context
    var mainContext = Engine.createContext();

    // Determine map-type
    var mapType;
    if ('L' in window && typeof L.Map == 'function') {
        mapType = MapView.MapType.LEAFLET;
    }
    else if ('ol' in window && typeof ol.Map == 'function') {
        mapType = MapView.MapType.OPENLAYERS3;
    }
    else {
        mapType = MapView.MapType.GOOGLEMAPS;
    }

    //
    // Create map-view
    //
    var zoom = 14;
    var center = {lat: 51.4400867, lng: 5.4782571};
    var mapView;
    switch (mapType) {
    case MapView.MapType.LEAFLET:
    case MapView.MapType.OPENLAYERS3:

        // Create leaflet or ol3 map-view
        mapView = new MapView({
            type: mapType,
            mapOptions: {
                zoom: zoom,
                center: center
            }
        });
        break;
    case MapView.MapType.GOOGLEMAPS:

        // Create google-maps map-view
        mapView = new MapView({
            type: mapType,
            mapOptions: {
                zoom: zoom,
                center: center,
                disableDefaultUI: false,
                disableDoubleClickZoom: true,
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                minZoom: 3
            }
        });
        break;
    }
    mainContext.add(mapView);

    //
    // Create title
    //
    var title = new Surface({
        size: [true, true],
        content: 'famous-map demo',
        classes: ['title']
    });
    var titleModifier = new Modifier({
        align: [0.5, 0],
        origin: [0.5, 0],
        transform: Transform.translate(0, 20, 0)
    });
    mainContext.add(titleModifier).add(title);

    //
    // Create instructions
    //
    var instructions = new Surface({
        size: [400, 140],
        content: 'Things to try out:<li>Move the map</li><li>Zoom the map</li><li>Click on a landmark</li>' +
            (mapType === MapView.MapType.OPENLAYERS3 ? '<li>Rotate the map (Alt+Shift+Drag)</li>' : ''),
        classes: ['instruction']
    });
    var instructionsModifier = new Modifier({
        align: [0.0, 1.0],
        origin: [0.0, 1.0]
    });
    mainContext.add(instructionsModifier).add(instructions);

    //
    // Wait for the map to load and initialize
    //
    mapView.on('load', function() {

        // Add Leaflet tile-layer
        if (mapType === MapView.MapType.LEAFLET) {
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
                //maxZoom: 18
            }).addTo(mapView.getMap());
        }
        else if (mapType === MapView.MapType.OPENLAYERS3) {
            mapView.getMap().addLayer(new ol.layer.Tile({source: new ol.source.OSM()}));
        }

        //
        // Create compass
        //
        var compass = new ImageSurface({
            size: [128, 128],
            content: 'images/compass.png',
            classes: ['compass']
        });
        var compassModifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        var compassMapModifier = new MapModifier({
            mapView: mapView,
            position: mapView
            //zoomBase: 14
        });
        mainContext.add(compassModifier).add(compassMapModifier).add(compass);

        //
        // Define landmarks
        //
        var i, landmarks = [
            {
                name: 'Yellow pins',
                position: {lat: 51.4452133, lng: 5.4806269},
                image: 'images/pins.png',
                infoImage: 'http://upload.wikimedia.org/wikipedia/commons/b/b1/FlyingPins.jpg'
            },
            {
                name: 'Evoluon',
                position: {lat: 51.443569, lng: 5.446869},
                image: 'images/evoluon.png',
                infoImage: 'http://www.eindhovenfotos.nl/evoluo6.jpg'
            },
            {
                name: 'Philips Stadium',
                position: {lat: 51.4416315, lng: 5.467244},
                image: 'images/stadium.png',
                infoImage: 'http://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Ventilating_corner_seats_of_Philips_Stadion.JPG/1024px-Ventilating_corner_seats_of_Philips_Stadion.JPG'
            }
        ];
        function _panToLandmark(e) {

            // Move the center of the map to the landmark
            var center2 = this.getPosition();
            mapView.halt();
            mapView.setPosition(
                {lat: MapUtility.lat(center2) - 0.006, lng: MapUtility.lng(center2)},
                { duration: 1000, curve: Easing.outBack }
            );

            // Position the compass just below the landmark and make it rotate towards it
            compassMapModifier.rotateTowardsFrom(this.getPosition());
        }
        for (i = 0; i < landmarks.length; i++) {
            var landmark = landmarks[i];

            //
            // Create landmark
            //
            var image = new ImageSurface({
                size: [true, true],
                content: landmark.image
            });
            var modifier = new Modifier({
                align: [0, 0],
                origin: [0.5, 0.5]
            });
            var mapModifier = new MapModifier({
                mapView: mapView,
                position: landmark.position,
                zoomBase: 15
            });
            image.on('click', _panToLandmark.bind(mapModifier));
            mainContext.add(mapModifier).add(modifier).add(image);

            //
            // Create info-box for the landmark
            //
            var info = new ImageSurface({
                size: [true, 200],
                classes: ['info'],
                content: landmark.infoImage
            });
            var infoModifier = new Modifier({
                align: [0, 0],
                origin: [0.5, 0.0],
                transform: Transform.translate(0, -250, 0)
            });
            var infoMapModifier = new MapModifier({
                mapView: mapView,
                position: mapModifier,
                zoomBase: 15
            });
            info.on('click', _panToLandmark.bind(mapModifier));
            mainContext.add(infoMapModifier).add(infoModifier).add(info);
        }

        //
        // Create a traveller which drives around
        //
        var roundabout = [
            {lat: 51.4347897, lng: 5.452068},
            {lat: 51.4470413, lng: 5.4474332},
            {lat: 51.4520125, lng: 5.4643767},
            {lat: 51.4529585, lng: 5.4733755},
            {lat: 51.4524705, lng: 5.4941894},
            {lat: 51.4471025, lng: 5.5004336},
            {lat: 51.4383345, lng: 5.5051329},
            {lat: 51.4284487, lng: 5.5016138},
            {lat: 51.4237288, lng: 5.4911202},
            {lat: 51.4250333, lng: 5.474351},
            {lat: 51.4286323, lng: 5.4603713},
            {lat: 51.4315555, lng: 5.4541915}
        ];
        var traveller = new ImageSurface({
            size: [48, 48],
            classes: ['car'],
            content: 'images/traveller.png'
        });
        var travellerModifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        var travellerMapModifier = new MapStateModifier({
            mapView: mapView,
            position: roundabout[0],
            zoomBase: 15
        });
        mainContext.add(travellerMapModifier).add(travellerModifier).add(traveller);

        //
        // Let the traveller drive around the roundabout
        //
        var roundaboutIndex = 0;
        function _driveRoundabout() {
            roundaboutIndex = (roundaboutIndex + 1) % roundabout.length;
            var position = roundabout[roundaboutIndex];
            travellerMapModifier.setPosition(
                position,
                { method: 'map-speed', speed2: 3000 }, // km/h
                _driveRoundabout
            );
        }
        _driveRoundabout();

        // Let the compass rotate towards the traveller
        compassMapModifier.rotateTowardsFrom(travellerMapModifier);
    });
});
