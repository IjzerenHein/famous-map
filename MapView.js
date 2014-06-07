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
    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var MapPositionTransitionable = require('./MapPositionTransitionable');
    
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
        this._position = new MapPositionTransitionable(this.options.mapOptions.center);
        this._zoom = new Transitionable(this.options.mapOptions.zoom);
        
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

        // Try to find DOM element
        var elm = document.getElementById(this.mapId);
        if (!elm) { return; }
        
        // Create map
        this.map = new google.maps.Map(elm, this.options.mapOptions);

        // Listen for the first occurance of 'projection_changed', to ensure the map is full
        // initialized.
        var func = this.map.addListener('projection_changed', function () {
            google.maps.event.removeListener(func);
            
            // Finalize initialisation
            this._initComplete = true;
            this._eventOutput.emit('load', this);
        }.bind(this));
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
     * Set the center of the map to the given geographical coordinates (Latitude, Longitude).
     *
     * @method setPosition
     * @chainable
     * @param {LatLng} position Position in geographical coordinates (Latitude, Longitude).
     * @param {Transitionable} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapView.prototype.setPosition = function (position, transition, callback) {
        this._position.set(position, transition, callback);
        return this;
    };

    /**
     * Get the current center position of the map.
     *
     * @method getPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapView.prototype.getPosition = function () {
        //return this._position.get();
        return this.map.getCenter();
    };
    
    /**
     * Get the destination center position of the map.
     *
     * @method getFinalPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapView.prototype.getFinalPosition = function () {
        return this._position.getFinal();
    };
    
    /**
     * Set the zoom-level.
     *
     * @method setZoom
     * @chainable
     * @param {Number} zoom Zoom-level for the map (0 = zoomed-out), must be a whole number.
     * @param {Transitionable} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapView.prototype.setZoom = function (zoom, transition, callback) {
        this._zoom.set(zoom, transition, callback);
        return this;
    };
    
    /**
     * Calculates the rotation-angle between two given positions.
     *
     * @method rotationFromPositions
     * @param {LatLng} start Start position.
     * @param {LatLng} start End position.
     * @param {Number} Rotation in radians.
     */
    MapView.prototype.rotationFromPositions = function (start, end) {
        return Math.atan2(start.lng() - end.lng(), start.lat() - end.lat()) + (Math.PI / 2.0);
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
        this._position.halt();
        this._zoom.halt();
    };
    
    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     * @return {Bool} True when there are active transitions running.
     */
    MapView.prototype.isActive = function () {
        return this._position.isActive() || this._zoom.isActive();
    };
    
    /**
     * Renders the view.
     *
     * @method render
     */
    MapView.prototype.render = function render() {
        
        // Init the map (once)
        if (!this.map) { this._initMap(); }
        
        // Get/set center and zoom
        if (this._initComplete) {
            var options;
            if (this._position.isActive()) {
                options = {
                    center: this._position.get()
                };
            } else {
                this._position.reset(this.map.getCenter());
            }
            if (this._zoom.isActive()) {
                if (options) {
                    options.zoom = Math.round(this._zoom.get());
                } else {
                    options = {
                        zoom: Math.round(this._zoom.get())
                    };
                }
            } else {
                this._zoom.reset(this.map.getZoom());
            }
            if (options) {
                this.map.setOptions(options);
            }
        }
        
        // Call super
        return this._node.render();
    };

    module.exports = MapView;
});
