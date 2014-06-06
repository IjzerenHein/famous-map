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

/* globals define */
var _globalMapViewId = 1;
define(function (require, exports, module) {
    'use strict';
    
    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var Timer = require('famous/utilities/Timer');
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');
    
    /**
     * A view containing a google-map
     *
     * @class MapView
     * @constructor
     * @param {Object} [options] Configuration options.
     */
    function MapView() {
        View.apply(this, arguments);
        
        // Initialize
        this.map = null;
        this._finalPosition = this.options.mapOptions.center;
        this._finalZoom = this.options.mapOptions.zoom;
        
        // When a specific dom-id is specified, use that
        if (this.options.mapOptions && this.options.mapOptions.id) {
            this.mapId = this.options.mapOptions.id;
        } else {
            
            // Otherwise generate unique id, and create the div ourselves
            this.mapId = 'MapView' + _globalMapViewId;
            _globalMapViewId++;
            
            // Insert div into the DOM
            var surface = new Surface({
                classes: ['mapview'],
                content: '<div id="' + this.mapId + '" style="width: 100%; height: 100%;"></div>',
                size: [undefined, undefined]
            });
            this.add(surface);
        }
        
        // Create transitionables
        this._currentLat = new Transitionable(this._finalPosition.lat());
        this._currentLng = new Transitionable(this._finalPosition.lng());
        this._currentZoom = new Transitionable(this._finalZoom);
        
        // Initialize the map after rendering has completed.
        // For some reason, this needs to be after the second
        // render-cycle... ?
        Timer.after(this._initMap.bind(this), 2);
    }
    MapView.prototype = Object.create(View.prototype);
    MapView.prototype.constructor = MapView;
    
    MapView.DEFAULT_OPTIONS = {
        moveTransition: { duration: 500, curve: Easing.outQuad },
        zoomTransition: { duration: 500, curve: Easing.inOutSine },
        mapOptions: {
            zoom: 10,
            center: new google.maps.LatLng(51.4400867, 5.4782571),
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
    };
    
    /**
     * Initializes the map (happens after the DOM element has been created
     * @method _initMap
     * @private
     */
    MapView.prototype._initMap = function () {

        // Check init pre-requisites and find DOM element
        if (this.map) { return; }
        var elm = document.getElementById(this.mapId);
        if (!elm) { throw 'mapView could not locate DOM-element with id: ' + this.mapId; }
        this._domElement = elm;
        
        // Create map
        var map = new google.maps.Map(elm, this.options.mapOptions);

        // Listen for the first occurance of 'projection_changed', to ensure the map is full
        // initialized.
        var func = map.addListener('projection_changed', function () {
            google.maps.event.removeListener(func);
            
            // Finalize initialisation
            this.map = map;
            this._eventOutput.emit('load', this);
        }.bind(this));
    };

    /**
     * Starts- or stops the timer dependent on whether any transitions are active.
     * 
     * @method _updateTimer
     * @private
     */
    MapView.prototype._updateTimer = function () {
        if (this._timer) {
            
            // Stop timer if no more transitions exist
            if (!this.isActive()) {
                Timer.clear(this._timer);
                this._timer = null;
            }
        } else {
            
            // Start timer when transitions have ben added
            if (this.isActive()) {
                this._timer = Timer.every(function () {
                    this._updateMap();
                }.bind(this));
            }
        }
    };

    /**
     * Updates the map accordingly to the added transitions.
     * 
     * @method _updateMap
     * @private
     */
    MapView.prototype._updateMap = function () {
        
        // Get position & zoom
        var position = new google.maps.LatLng(
            this._currentLat.get(),
            this._currentLng.get()
        );
        var zoom = Math.round(this._currentZoom.get());
        
        //this.map.setCenter(position);
        // Set new map position and zoom
        this.map.setOptions({
            center: position,
            zoom: zoom
        });
  
        // Stop animation timer when all animations are finished
        this._updateTimer();
    };
    
    /**
     * Gets the internal map-object. This object may not yet have been initialized.
     * The object is guarenteed to be valid after the 'load' event has been emited.
     *
     * @method getMap
     * @return {Map} Map object.
     */
    MapView.prototype.getMap = function () {
        return this.map;
    };

    /**
     * Changes the center of the map to the given geographical coordinates (Latitude, Longitude).
     *
     * @method panToPosition
     * @param {LatLng} position Position in geographical coordinates (Latitude, Longitude).
     * @param {Transitionable} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapView.prototype.panToPosition = function (position, transition, callback) {
        
        // Set new position
        this._finalPosition = position;
        transition = transition || this.options.moveTransition;
        this._currentLng.set(this._finalPosition.lng(), transition, callback);
        this._currentLat.set(this._finalPosition.lat(), transition);
        this._currentZoom.set(this._finalZoom, transition);
        
        // Start the timer
        this._updateTimer();
    };

    /**
     * Get the destination center position of the map.
     *
     * @method getFinalPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapView.prototype.getFinalPosition = function () {
        return this._finalPosition;
    };
    
    /**
     * Set the zoom-level.
     *
     * @method setZoom
     * @param {Number} zoom Zoom-level for the map (0 = zoomed-out), must be a whole number.
     * @param {Transitionable} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapView.prototype.setZoom = function (zoom, transition, callback) {
        
        // Set new position
        this._finalZoom = zoom;
        transition = transition || this.options.zoomTransition;
        this._currentLng.set(this._finalPosition.lng(), transition);
        this._currentLat.set(this._finalPosition.lat(), transition);
        this._currentZoom.set(this._finalZoom, transition, callback);
        
        // Start the timer
        this._updateTimer();
    };
    
    /**
     * Set the marker position, with the option to use a transition.
     *
     * @method setMarkerPosition
     * @param {Marker} marker Marker for which to update the position.
     * @param {LatLng} position Position in geographical coordinates (Latitude, Longitude).
     * @param {Transitionable} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     * @param {Object} [cache] cache to use when making transitions.
     * @return {Object} Cache object. Re-suply this to setMarkerPosition to ensure previous transitions are cancelled, prior to starting a new one.
     */
    MapView.prototype.setMarkerPosition = function (marker, position, transition, callback, cache) {
        
        // When no transition specified, do it immediately
        if (!transition) {
            marker.setPosition(position);
            if (callback) {
                callback(this, marker);
            }
            return null;
        }
        
        // Create/re-use transitionables
        var transitionables;
        if (cache) {
            transitionables = cache;
            transitionables.lat.reset(marker.getPosition().lat());
            transitionables.lng.reset(marker.getPosition().lng());
        } else {
            transitionables = {
                lat: new Transitionable(marker.getPosition().lat()),
                lng: new Transitionable(marker.getPosition().lng())
            };
        }
        
        // Start animation
        var timer = Timer.every(function () {
            var newPosition = new google.maps.LatLng(
                transitionables.lat.get(),
                transitionables.lng.get()
            );
            marker.setPosition(newPosition);
        }, 0);
        
        // Create transition
        transitionables.lat.set(position.lat(), transition, function () {
            
            // Completion handler
            if (timer) {
                Timer.clear(timer);
                timer = null;
            }
            if (callback) {
                callback(this);
            }
        }.bind(this));
        transitionables.lng.set(position.lng(), transition);
        
        return transitionables;
    };

    /**
     * Get the position in pixels, relative to the left-top of the container, for the given geographical position.
     *
     * @method pointFromPosition
     * @param {LatLng} Position in geographical coordinates (Latitude, Longitude).
     * @return {Point} Position in pixels, relative to the left-top of the mapView.
     */
    MapView.prototype.pointFromPosition = function (position) {
        var topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
        var bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
        var scale = Math.pow(2, this.map.getZoom());
        var worldPoint = this.map.getProjection().fromLatLngToPoint(position);
        var point = new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
        return point;
    };

    /**
     * Get the geographical coordinates for a given position in pixels, relative to the left-top of the container.
     *
     * @method positionFromPoint
     * @param {Point} point Position in pixels, relative to the left-top of the mapView.
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude).
     */
    MapView.prototype.positionFromPoint = function (point) {
        var topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
        var bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
        var scale = Math.pow(2, this.map.getZoom());
        var worldPoint = new google.maps.Point((point.x / scale) + bottomLeft.x, (point.y / scale) + topRight.y);
        var position = this.map.getProjection().fromPointToLatLng(worldPoint);
        return position;
    };
    
    /**
     * Halts any pending transitions.
     *
     * @method halt
     */
    MapView.prototype.halt = function () {
        this._currentLat.halt();
        this._currentLng.halt();
        this._currentZoom.halt();
        
        this._finalPosition = this.map.getCenter();
        this._finalZoom = this.map.getZoom();
        
        this._updateTimer();
    };
    
    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     * @return {Bool} True when there are active transitions running.
     */
    MapView.prototype.isActive = function () {
        return this._currentLat.isActive() ||
                this._currentLng.isActive() ||
                this._currentZoom.isActive();
    };
    
    // WORK IN PROGRESS
    /**
     * Get the geographical coordinates for a given x/y point in pixels (relative to the left-top of the container).
     *
     * @method positionFromPoint
     * @param {Point} point X/Y point in pixels relative to the left-top of the mapView.
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude).
     */
    /*MapView.prototype.getZoomForBounds = function (bounds, maxWidth, maxHeight) {
        
        // Calculate max- width/height in pixels
        var topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
        var bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
        var scale = Math.pow(2, this.map.getZoom());
        if (!maxWidth) { maxWidth = (topRight.x - bottomLeft.x) * scale; }
        if (!maxHeight) { maxHeight = (bottomLeft.y - topRight.y) * scale; }
        
        
        var zoom = this.map.getZoom();
        topRight = this.map.getProjection().fromLatLngToPoint(bounds.getNorthEast());
        bottomLeft = this.map.getProjection().fromLatLngToPoint(bounds.getSouthWest());
        var width = (topRight.x - bottomLeft.x) * scale;
        var height = (bottomLeft.y - topRight.y) * scale;
        
        if ((width < maxWidth) && (height < maxHeight)) {
            do {
                zoom++;
                scale = Math.pow(2, zoom);
                width = (topRight.x - bottomLeft.x) * scale;
                height = (bottomLeft.y - topRight.y) * scale;
            } while ((width < maxWidth) && (height < maxHeight));
            zoom--;
        } else {
            do {
                zoom--;
                scale = Math.pow(2, zoom);
                width = (topRight.x - bottomLeft.x) * scale;
                height = (bottomLeft.y - topRight.y) * scale;
            } while ((width > maxWidth) && (height > maxHeight));
            zoom++;
        }
        console.log('width: ' + width + ', height: ' + height + ', zoom: ' + zoom);
        return zoom;
    };*/

    module.exports = MapView;
});
