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

/**
 * @title MapView
 * 
 * MapView encapsulates a Google maps view so it can be used with famo.us.
 *
 * Additionally it adds methods to set the position and zoom-factor of the map using transitions.
 * Use `MapModifier` and `MapStateModifier` to place famo.us renderables on the map, much like google-maps markers.
 *
 * ### Options
 *
 * **mapOptions**: Options that are passed directly to the google.maps.Map object. The options should include the 'center' and 'zoom'.
 *
 * **[id]**: Id of the DOM-element to use. When ommitted, a DOM-element is created using a surface.
 *
 * **[zoomTransition]**: Transition to use for smoothly zooming renderables (by default a transition of 120 ms is used).
 */
var _globalMapViewId = 1;
define(function (require, exports, module) {
    'use strict';
    
    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var MapPositionTransitionable = require('./MapPositionTransitionable');
    
    /**
     * A view containing a google-map
     *
     * @class MapView
     * @constructor
     * @param {Object} options Options.
     */
    function MapView() {
        View.apply(this, arguments);
        
        // Initialize
        this.map = null;
        this._position = new MapPositionTransitionable(this.options.mapOptions.center);
        this._zoomFinal = this.options.mapOptions.zoom;
        this._bounds = {
            northEast: new MapPositionTransitionable(this.options.mapOptions.center),
            southWest: new MapPositionTransitionable(this.options.mapOptions.center)
        };
        this._cache = {};
        
        // When a specific dom-id is specified, use that
        if (this.options.mapOptions && this.options.id) {
            this.mapId = this.options.id;
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
    
    /**
     * @property MapView.DEFAULT_OPTIONS
     */
    MapView.DEFAULT_OPTIONS = {
        mapOptions: {
            zoom: 10,
            center: new google.maps.LatLng(51.4400867, 5.4782571),
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        },
        id: null,
        zoomTransition: {duration: 100}
    };
    
    /**
     * Initializes the map (happens after the DOM element has been created).
     *
     * @method _initMap
     * @private
     * @ignore
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
     * Get the internal map-object. This object may not yet have been initialized, the map is only
     * guarenteed to be valid after the 'load' event has been emited.
     *
     * @method getMap
     * @return {Map} Google-maps Map object.
     */
    MapView.prototype.getMap = function () {
        return this.map;
    };

    /**
     * Set the center of the map to the given geographical coordinates.
     *
     * @method setPosition
     * @param {LatLng} position Position in geographical coordinates.
     * @param {Transitionable} [transition] Transitionable.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapView.prototype.setPosition = function (position, transition, callback) {
        this._position.set(position, transition, callback);
        this._positionInvalidated = true;
        return this;
    };

    /**
     * Get the current center position of the map, in geographical coordinates.
     *
     * @method getPosition
     * @return {LatLng} Position in geographical coordinates.
     */
    MapView.prototype.getPosition = function () {
        return this._position.get();
    };
    
    /**
     * Get the destination center position of the map, in geographical coordinates.
     *
     * @method getFinalPosition
     * @return {LatLng} Position in geographical coordinates.
     */
    MapView.prototype.getFinalPosition = function () {
        return this._position.getFinal();
    };
    
    /**
     * Set the zoom-level of the map.
     *
     * @method setZoom
     * @param {Number} zoom Zoom-level for the map.
     * @param {Transitionable} [transition] Transitionable.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapView.prototype.setZoom = function (zoom, transition, callback) {
        this.map.setZoom(zoom, transition, callback);
        // TODO transitions??!?
        return this;
    };
    
    /**
     * Get the current zoom-level of the map.
     
     * As opposed to Map.getZoom(), this function
     * takes into account a smooth transition between zoom-levels. E.g., when zooming from
     * zoom-level 4 to 5, this function returns an increasing value starting at 4 and ending
     * at 5, over time. The transition time can be set as an option.
     *
     * @method getZoom
     * @return {Number} Zoom-level.
     */
    MapView.prototype.getZoom = function () {
        return this._cache.zoom;
    };
    
    /**
     * Calculates the rotation-angle between two given positions.
     *
     * @method rotationFromPositions
     * @param {LatLng} start Start position.
     * @param {LatLng} end End position.
     * @return {Number} Rotation in radians.
     */
    MapView.prototype.rotationFromPositions = function (start, end) {
        return Math.atan2(start.lng() - end.lng(), start.lat() - end.lat()) + (Math.PI / 2.0);
    };

    /**
     * Get the position in pixels (relative to the left-top of the container) for the given geographical position.
     *
     * @method pointFromPosition
     * @param {LatLng} Position in geographical coordinates.
     * @return {Point} Position in pixels, relative to the left-top of the mapView.
     */
    MapView.prototype.pointFromPosition = function (position) {
        var worldPoint = this.map.getProjection().fromLatLngToPoint(position);
        return new google.maps.Point(
            (worldPoint.x - this._cache.bottomLeft.x) * this._cache.scale,
            (worldPoint.y - this._cache.topRight.y) * this._cache.scale
        );
    };
    
    /**
     * Get the geographical coordinates for a given position in pixels (relative to the left-top of the container).
     *
     * @method positionFromPoint
     * @param {Point} point Position in pixels, relative to the left-top of the mapView.
     * @return {LatLng} Position in geographical coordinates.
     */
    MapView.prototype.positionFromPoint = function (point) {
        var worldPoint = new google.maps.Point(
            (point.x / this._cache.scale) + this._cache.bottomLeft.x,
            (point.y / this._cache.scale) + this._cache.topRight.y
        );
        return this.map.getProjection().fromPointToLatLng(worldPoint);
    };
    
    /**
     * Get the size of the map-view in pixels.
     *
     * @method getSize
     * @return {Array.Number} Size of the mapView.
     */
    MapView.prototype.getSize = function () {
        return this._cache.size;
    };
        
    /**
     * Halts any pending transitions.
     *
     * @method halt
     */
    MapView.prototype.halt = function () {
        this._position.halt();
        this._positionInvalidated = true;
    };
    
    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     * @return {Bool} True when there are active transitions running.
     */
    MapView.prototype.isActive = function () {
        return this._position.isActive();
    };
    
    /**
     * @method _updateCache
     * @private
     * @ignore
     */
    MapView.prototype._updateCache = function (zoom, northEast, southWest) {
        
        // Store final data
        this._cache.finalZoom = zoom;
        this._cache.finalScale = Math.pow(2, this._cache.finalZoom);
        this._cache.finalNorthEast = northEast;
        this._cache.finalSouthWest = southWest;
        
        // Calculate size of the MapView
        var projection = this.map.getProjection();
        var topRight = projection.fromLatLngToPoint(northEast);
        var bottomLeft = projection.fromLatLngToPoint(southWest);
        this._cache.size = [
            (topRight.x - bottomLeft.x) * this._cache.finalScale,
            (bottomLeft.y - topRight.y) * this._cache.finalScale
        ];
        
        // Calculate current world point edges and scale
        this._cache.topRight = projection.fromLatLngToPoint(this._bounds.northEast.get());
        this._cache.bottomLeft = projection.fromLatLngToPoint(this._bounds.southWest.get());
        this._cache.scale = this._cache.size[0] / (this._cache.topRight.x - this._cache.bottomLeft.x);
        this._cache.zoom = Math.log(this._cache.scale) / Math.log(2);
    };

    /**
     * Renders the view.
     *
     * @method render
     * @private
     * @ignore
     */
    MapView.prototype.render = function render() {
        
        // Init the map (once)
        if (!this.map) { this._initMap(); }
        if (this._initComplete) {
            
            // When the zoom-level is changed by google-maps, start a transition
            // that runs alongside.
            var options;
            var zoom = this.map.getZoom();
            var bounds = this.map.getBounds();
            var northEast = bounds.getNorthEast();
            var southWest = bounds.getSouthWest();
            var invalidateCache = false;
            if (zoom !== this._cache.finalZoom) {
                this._bounds.northEast.halt();
                this._bounds.southWest.halt();
                this._bounds.northEast.set(northEast, this.options.zoomTransition);
                this._bounds.southWest.set(southWest, this.options.zoomTransition);
                invalidateCache = true;
            } else if (!this._bounds.northEast.isActive()) {
                this._bounds.northEast.reset(northEast);
                this._bounds.southWest.reset(southWest);
            } else {
                invalidateCache = true;
            }
            
            // Update the cache
            if (invalidateCache || (zoom !== this._cache.finalZoom) ||
                    !northEast.equals(this._cache.finalNorthEast) ||
                    !southWest.equals(this._cache.finalSouthWest)) {
                //console.log('updating cache..');
                this._updateCache(zoom, northEast, southWest);
            }

            // Get/set map center
            if (this._position.isActive() || this._positionInvalidated) {
                options = {
                    center: this._position.get()
                };
                this._positionInvalidated = false;
            } else {
                this._position.reset(this.map.getCenter());
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
