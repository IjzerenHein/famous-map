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
 * Owner: hrutjes@gmail.com
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
    var Timer = require('famous/utilities/Timer');
    var MapView = require('famous-map/MapView');
    var Map = require('famous-map/MapItem');
    var MapItemModifier = require('famous-map/MapItemModifier');
    var MapItemStateModifier = require('famous-map/MapItemStateModifier');

    // create the main context
    var mainContext = Engine.createContext();

    // Create FPS indicator
    _createFPS(mainContext);
    
    // Create map-view
    var mapView = _createMapView(mainContext);
    

    // Wait for the map to load and initialize
    mapView.on('load', function () {

        // Create map items
        var homer = _createHomer(mainContext, mapView);
        _createArrow(mainContext, mapView, homer);
        _createMarge(mainContext, mapView, homer);
        _createPins(mainContext, mapView);
        _createSaucer(mainContext, mapView);

        // Transitions are chained. The following example first pans to the position twice
        // and then zooms in. Use '.halt' to cancel the transitions and start new ones.
        mapView.panToPosition(new google.maps.LatLng(51.8721795, 5.7101037), { duration: 4000, curve: Easing.outQuad });
        mapView.panToPosition(new google.maps.LatLng(51.4400867, 5.4782571));
        mapView.setZoom(14);
        
        // Homer is taking a road-trip
        var i, j, trip = [
            new google.maps.LatLng(51.8721795, 5.7101037),
            new google.maps.LatLng(51.4400867, 5.4782571)
        ];
        homer.rotateTowards(trip[0], { duration: 200 });
        for (j = 0; j < trip.length; j++) {
            homer.setPosition(trip[j], { duration: 4000, curve: Easing.outQuad }, function (j) {
                if ((j + 1) < trip.length) {
                    homer.rotateTowards(trip[j + 1], { duration: 200 });
                }
            }.bind(this, j));
        }
        
        // Drive circles around town until homer gets tired of it
        var roundabout = [
            new google.maps.LatLng(51.4347897, 5.452068),
            new google.maps.LatLng(51.4470413, 5.4474332),
            new google.maps.LatLng(51.4520125, 5.4643767),
            new google.maps.LatLng(51.4524705, 5.4941894),
            new google.maps.LatLng(51.4383345, 5.5051329),
            new google.maps.LatLng(51.4284487, 5.5016138),
            new google.maps.LatLng(51.4237288, 5.4911202),
            new google.maps.LatLng(51.4250333, 5.474351),
            new google.maps.LatLng(51.4286323, 5.4603713),
            new google.maps.LatLng(51.4315555, 5.4541915)
        ];
        homer.rotateTowards(roundabout[0]);
        for (i = 0; i < 10; i++) {
            for (j = 0; j < roundabout.length; j++) {
                //homer.rotateTowards(roundabout[j], { duration: 100, curve: Easing.outQuad });
                homer.setPosition(roundabout[j], { duration: 2000 }, function (j) {
                    if ((j + 1) < roundabout.length) {
                        homer.rotateTowards(roundabout[j + 1], { duration: 200 });
                    } else {
                        homer.rotateTowards(roundabout[0], { duration: 200 });
                    }
                }.bind(this, j));
            }
        }

        // Show info-box with a slight delay
        Timer.setTimeout(function () {
            _createInfoBox(mainContext, mapView);
        }, 8000);
    });
    
    /**
     * Creates the FPS-indicator in the right-top corner.
     * 
     * @method _createFPS
     * @private
     */
    function _createFPS(context) {
    
        // Render FPS in right-top
        var modifier = new Modifier({
            align: [1, 0],
            origin: [1, 0],
            size: [100, 50]
        });
        var surface = new Surface({
            content: 'fps',
            classes: ['fps']
        });
        context.add(modifier).add(surface);
        
        // Update every 5 ticks
        Timer.every(function () {
            surface.setContent(Math.round(Engine.getFPS()) + ' fps');
        }, 2);
    }
    
    /**
     * @method _createMapView
     * @private
     */
    function _createMapView(context) {
        var mapView = new MapView({
            mapOptions: {
                zoom: 10,
                center: new google.maps.LatLng(52.3747158, 4.8986166),
                disableDefaultUI: false,
                disableDoubleClickZoom: true,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            },
            moveTransition: { duration: 4000, curve: Easing.outQuad },
            zoomTransition: { duration: 5000, curve: Easing.inOutSine }
        });
        context.add(mapView);
        return mapView;
    }
    
    /**
     * @method _createArrow
     * @private
     */
    function _createArrow(context, mapView, homer) {
        
        // Create the homer-mobile which travels across the map
        var surface = new ImageSurface({
            size: [true, true],
            classes: ['arrow'],
            content: '../content/images/arrow.png'
        });
        var center = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        var rotation = new Modifier({
            transform: Transform.rotateZ(Math.PI / 2)
        });
        var modifier = new MapItemModifier({
            mapView: mapView,
            position: new google.maps.LatLng(51.4367399, 5.4812397),
            rotateTowards: homer,
            zoomBase: 14
        });
        context.add(modifier).add(center).add(rotation).add(surface);
        return modifier;
    }
    
    /**
     * @method _createHomer
     * @private
     */
    function _createHomer(context, mapView) {
        
        // Create the homer-mobile which travels across the map
        var surface = new ImageSurface({
            size: [80, true],
            classes: ['car'],
            content: '../content/images/homer.png'
        });
        var center = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5],
            transform: Transform.rotateZ((Math.PI / 180) * -11)
        });
        var modifier = new MapItemStateModifier({
            mapView: mapView,
            position: new google.maps.LatLng(52.3747158, 4.8986166)
        });
        context.add(modifier).add(center).add(surface);
        return modifier;
    }
    
    /**
     * @method _createMarge
     * @private
     */
    function _createMarge(context, mapView, homer) {
        var modifier = new MapItemModifier({
            mapView: mapView,
            position: new google.maps.LatLng(51.8538331, 5.3576616)
        });
        var center = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        var surface = new ImageSurface({
            size: [true, true],
            classes: ['marge'],
            content: '../content/images/marge.png'
        });
        context.add(modifier).add(center).add(surface);
        return modifier;
    }

    /**
     * @method _createInfoBox
     * @private
     */
    function _createInfoBox(context, mapView) {
        var modifier = new Modifier({
            align: [1, 1],
            origin: [1, 1],
            transform: Transform.translate(-30, -30, 0)
        });
        var surface = new Surface({
            size: [200, 160],
            content: 'Move the map by hand and see how MapItems stick to the map.',
            classes: ['info']
        });
        context.add(modifier).add(surface);
        return modifier;
    }
    
    /**
     * @method _createPins
     * @private
     */
    function _createPins(context, mapView) {
        var modifier = new MapItemModifier({
            mapView: mapView,
            position: new google.maps.LatLng(51.4452133, 5.4806269),
            zoomBase: 14,
            zoomScale: 0.5
        });
        var center = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        var surface = new ImageSurface({
            size: [true, true],
            content: '../content/images/pins.png',
            classes: ['pins']
        });
        context.add(modifier).add(center).add(surface);
        return modifier;
    }
    
    /**
     * @method _createSaucer
     * @private
     */
    function _createSaucer(context, mapView) {
        var modifier = new MapItemModifier({
            mapView: mapView,
            position: new google.maps.LatLng(51.443569, 5.446869),
            zoomBase: 14,
            zoomScale: 1
        });
        var center = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        var surface = new ImageSurface({
            size: [true, true],
            content: '../content/images/evoluon.png',
            classes: ['saucer']
        });
        context.add(modifier).add(center).add(surface);
        return modifier;
    }
});
