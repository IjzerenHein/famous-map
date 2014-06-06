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
    var Easing = require('famous/transitions/Easing');
    var Timer = require('famous/utilities/Timer');
    var MapView = require('famous-map/MapView');
    var MapItem = require('famous-map/MapItem');

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
        _createMarge(mainContext, mapView);
        _createPins(mainContext, mapView);
        _createSaucer(mainContext, mapView);

        // Transitions are chained. The following example first pans to the position twice
        // and then zooms in. Use '.halt' to cancel the transitions and start new ones.
        mapView.panToPosition(new google.maps.LatLng(51.8721795, 5.7101037), { duration: 4000, curve: Easing.outQuad });
        mapView.panToPosition(new google.maps.LatLng(51.4400867, 5.4782571));
        mapView.setZoom(14);
        
        // Homer is taking a road-trip
        homer.rotateTowards(new google.maps.LatLng(51.8721795, 5.7101037), { duration: 500, curve: Easing.outQuad });
        homer.setPosition(new google.maps.LatLng(51.8721795, 5.7101037), { duration: 2000, curve: Easing.outQuad });
        homer.rotateTowards(new google.maps.LatLng(51.4400867, 5.4782571), { duration: 500, curve: Easing.outQuad });
        homer.setPosition(new google.maps.LatLng(51.4400867, 5.4782571), { duration: 4000, curve: Easing.outQuad }, function () {
            
            // Drive circles around town until homer gets tired of it
            var i, j, roundabout = [
                new google.maps.LatLng(51.4347897, 5.452068),
                new google.maps.LatLng(51.4470413, 5.4474332),
                new google.maps.LatLng(51.4524705, 5.4941894),
                new google.maps.LatLng(51.4383345, 5.5051329),
                new google.maps.LatLng(51.4284487, 5.5016138),
                new google.maps.LatLng(51.4237288, 5.4911202),
                new google.maps.LatLng(51.4250333, 5.474351),
                new google.maps.LatLng(51.4286323, 5.4603713),
                new google.maps.LatLng(51.4315555, 5.4541915)
            ];
            for (i = 0; i < 10; i++) {
                for (j = 0; j < roundabout.length; j++) {
                    homer.rotateTowards(roundabout[j], { duration: 100, curve: Easing.outQuad });
                    homer.setPosition(roundabout[j], { duration: 2000 });
                }
            }
                        
            // Show info-box with a slight delay
            Timer.setTimeout(function () {
                _createInfoBox(mainContext, mapView);
            }, 4000);
        });
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
     * @method _createHomer
     * @private
     */
    function _createHomer(context, mapView) {
        
        // Create the homer-mobile which travels across the map
        var surface = new ImageSurface({
            size: [50, true],
            classes: ['car'],
            content: '../content/images/homer.png'
        });
        var mapItem = new MapItem({
            zoomScaleFactor: 0.2,
            position: new google.maps.LatLng(52.3747158, 4.8986166)
        }, mapView);
        context.add(mapItem);
        mapItem.show(surface, null, null, ((Math.PI / 180) * -5));
        return mapItem;
    }
    
    /**
     * @method _createMarge
     * @private
     */
    function _createMarge(context, mapView) {
        var surface = new ImageSurface({
            size: [true, true],
            classes: ['marge'],
            content: '../content/images/marge.png'
        });
        var mapItem = new MapItem({
            position: new google.maps.LatLng(51.4911905, 5.6651178)
        }, mapView);
        context.add(mapItem);
        mapItem.show(surface);
        return mapItem;
    }

    /**
     * @method _createInfoBox
     * @private
     */
    function _createInfoBox(context, mapView) {
    
        // Create renderable
        var surface = new Surface({
            size: [200, 160],
            content: 'Move the map by hand and see how MapItems sticks to the map.',
            classes: ['info']
        });

        // Show on map
        var mapItem = new MapItem({
            position: new google.maps.LatLng(51.4387491, 5.4758324)
        }, mapView);
        context.add(mapItem);
        mapItem.show(surface, { duration: 3000 });
        return mapItem;
    }
    
    /**
     * @method _createPins
     * @private
     */
    function _createPins(context, mapView) {
    
        // Create renderable
        var surface = new ImageSurface({
            size: [2, true],
            content: '../content/images/pins.png',
            classes: ['pins']
        });

        // Show on map
        var mapItem = new MapItem({
            zoomScaleFactor: 4.0,
            position: new google.maps.LatLng(51.4452133, 5.4806269)
        }, mapView);
        context.add(mapItem);
        mapItem.show(surface);
        return mapItem;
    }
    
    /**
     * @method _createSaucer
     * @private
     */
    function _createSaucer(context, mapView) {
    
        // Create renderable
        var surface = new ImageSurface({
            size: [2, true],
            content: '../content/images/evoluon.png',
            classes: ['saucer']
        });

        // Show on map
        var mapItem = new MapItem({
            zoomScaleFactor: 4.0,
            position: new google.maps.LatLng(51.443569, 5.446869)
        }, mapView);
        context.add(mapItem);
        mapItem.show(surface);
        return mapItem;
    }
});
