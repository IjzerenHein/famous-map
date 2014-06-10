/* 
 * Copyright (c) 2014 Gloey Apps
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*jslint browser:true, nomen:true, vars:true, plusplus:true*/
/*global define, google*/

define(function (require) {
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

    // create the main context
    var mainContext = Engine.createContext();

    //
    // Create map-view
    //
    var mapView = new MapView({
        mapOptions: {
            zoom: 14,
            center: new google.maps.LatLng(51.4400867, 5.4782571),
            disableDefaultUI: false,
            disableDoubleClickZoom: true,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
    });
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
        size: [300, 140],
        content: 'Things to try out:<li>Move the map</li><li>Zoom the map</li><li>Click on a landmark</li>',
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
    mapView.on('load', function () {

        //
        // Create compass
        //
        var compass = new ImageSurface({
            size: [128, 128],
            content: 'images/compass.png'
        });
        var compassModifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        var compassMapModifier = new MapModifier({
            mapView: mapView,
            position: mapView,
            zoomBase: 15,
            zoomScale: 0.5
        });
        mainContext.add(compassModifier).add(compassMapModifier).add(compass);
        
        
        //
        // Define landmarks
        //
        var i, landmarks = [
            {
                name: 'Yellow pins',
                position: new google.maps.LatLng(51.4452133, 5.4806269),
                image: 'images/pins.png',
                infoImage: 'http://upload.wikimedia.org/wikipedia/commons/b/b1/FlyingPins.jpg'
            },
            {
                name: 'Evoluon',
                position: new google.maps.LatLng(51.443569, 5.446869),
                image: 'images/evoluon.png',
                infoImage: 'http://www.eindhovenfotos.nl/evoluo6.jpg'
            },
            {
                name: 'Philips Stadium',
                position: new google.maps.LatLng(51.4416315, 5.467244),
                image: 'images/stadium.png',
                infoImage: 'http://www.gbsportstours.com/uploads/media/philips.jpg'
            }
        ];
        function _panToLandmark(e) {
            
            // Move the center of the map to the landmark
            mapView.halt();
            mapView.setPosition(
                this.getPosition(),
                { duration: 1000, curve: Easing.outBack }
            );
            
            // Position the compass just below the landmark and make it rotate towards it
            compassMapModifier.offsetFrom(new google.maps.LatLng(-0.006, 0));
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
            new google.maps.LatLng(51.4347897, 5.452068),
            new google.maps.LatLng(51.4470413, 5.4474332),
            new google.maps.LatLng(51.4520125, 5.4643767),
            new google.maps.LatLng(51.4529585, 5.4733755),
            new google.maps.LatLng(51.4524705, 5.4941894),
            new google.maps.LatLng(51.4471025, 5.5004336),
            new google.maps.LatLng(51.4383345, 5.5051329),
            new google.maps.LatLng(51.4284487, 5.5016138),
            new google.maps.LatLng(51.4237288, 5.4911202),
            new google.maps.LatLng(51.4250333, 5.474351),
            new google.maps.LatLng(51.4286323, 5.4603713),
            new google.maps.LatLng(51.4315555, 5.4541915)
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
            var oldPosition = travellerMapModifier.getPosition();
            var position = roundabout[roundaboutIndex];
            travellerMapModifier.setPosition(
                position,
                { duration: 2000 },
                _driveRoundabout
            );
        }
        _driveRoundabout();
        
        // Let the compass rotate towards the traveller
        compassMapModifier.rotateTowardsFrom(travellerMapModifier);
    });
});
