/**
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

/*global define, google, L*/

/**
 * MapView encapsulates a Google maps view so it can be used with famo.us.
 *
 * Additionally it adds methods to set the position and zoom-factor of the map using transitions.
 * Use `MapModifier` and `MapStateModifier` to place famo.us renderables on the map, much like google-maps markers.
 *
 * **Map-types**
 *
 * |Value|Description|
 * |---|---|
 * |MapType.GOOGLEMAPS (default)|Google-maps.|
 * |MapType.LEAFLET|Leaflet.js.|
 * @module
 */
var _globalMapViewId = 1;
define(function(require, exports, module) {
    'use strict';

    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var Transitionable = require('famous/transitions/Transitionable');
    var MapUtility = require('./MapUtility');
    var MapPositionTransitionable = require('./MapPositionTransitionable');
    var MapTransition = require('./MapTransition');
    Transitionable.registerMethod('map-speed', MapTransition);

    /*
     * Map-type
     * @enum {Number}
     * @alias module:MapView.MapType
     */
    var MapType = {
        GOOGLEMAPS: 1,
        LEAFLET: 2
    };

    /**
     * @class
     * @param {Object} options Options.
     * @param {MapType} options.type Map-type (e.g. MapView.MapType.GOOGLEMAPS, MapView.MapType.LEAFLET).
     * @param {Object} options.mapOptions Options that are passed directly to the Map object. The options should include the 'center' and 'zoom'.
     * @param {String} [options.id] Id of the DOM-element to use. When ommitted, a DOM-element is created using a surface.
     * @param {Transition} [options.zoomTransition] Transition to use for smoothly zooming renderables (by default a transition of 120 ms is used).
     * @alias module:MapView
     */
    function MapView() {
        View.apply(this, arguments);

        // Initialize
        this.map = null;
        this.mapType = this.options.type;
        this._position = new MapPositionTransitionable(this.options.mapOptions.center);
        this._zoom = {
            center: new MapPositionTransitionable(this.options.mapOptions.center),
            northEast: new MapPositionTransitionable(this.options.mapOptions.center),
            southWest: new MapPositionTransitionable(this.options.mapOptions.center)
        };
        this._cache = {};

        // Disable zoom-transitions for leaflet
        if (this.mapType === MapType.LEAFLET) {
            this.options.zoomTransition = {duration: 0};
        }

        // When a specific dom-id is specified, use that
        if (this.options.mapOptions && this.options.id) {
            this.mapId = this.options.id;
        }
        else {

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
    MapView.MapType = MapType;

    /**
     * @property DEFAULT_OPTIONS
     * @protected
     */
    MapView.DEFAULT_OPTIONS = {
        type: MapType.GOOGLEMAPS,
        mapOptions: {
            zoom: 10,
            center: {lat: 51.4400867, lng: 5.4782571}
        },
        id: null,
        zoomTransition: {duration: 100}
    };

    /**
     * Initializes the map (happens after the DOM element has been created).
     *
     * @private
     * @ignore
     */
    MapView.prototype._initMap = function() {

        // Try to find DOM element
        var elm = document.getElementById(this.mapId);
        if (!elm) {
            return;
        }

        // Supported map-types
        switch (this.mapType) {

        // Create google.maps.Map
        case MapType.GOOGLEMAPS:
            this.map = new google.maps.Map(elm, this.options.mapOptions);

            // Listen for the first occurance of 'projection_changed', to ensure the map is full
            // initialized.
            var func = this.map.addListener('projection_changed', function() {
                google.maps.event.removeListener(func);

                // Finalize initialisation
                this._initComplete = true;
                this._eventOutput.emit('load', this);
            }.bind(this));
            break;

        // Create leaflet Map
        case MapType.LEAFLET:
            this.map = L.map(elm, this.options.mapOptions);
            this._initComplete = true;
            this._eventOutput.emit('load', this);
            break;
        }
    };

    /**
     * Get the internal map-object. This object may not yet have been initialized, the map is only
     * guarenteed to be valid after the 'load' event has been emited.
     *
     * @return {Map} Map object.
     */
    MapView.prototype.getMap = function() {
        return this.map;
    };

    /**
     * Set the center of the map to the given geographical coordinates.
     *
     * @param {LatLng} position Position in geographical coordinates.
     * @param {Transitionable} [transition] Transitionable.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapView.prototype.setPosition = function(position, transition, callback) {
        this._position.set(position, transition, callback);
        this._positionInvalidated = true;
        return this;
    };

    /**
     * Get the current center position of the map, in geographical coordinates.
     *
     * @return {LatLng} Position in geographical coordinates.
     */
    MapView.prototype.getPosition = function() {
        return this._zoom.center.get();
    };

    /**
     * Get the destination center position of the map, in geographical coordinates.
     *
     * @return {LatLng} Position in geographical coordinates.
     */
    MapView.prototype.getFinalPosition = function() {
        return this._position.getFinal();
    };

    /**
     * Get the current zoom-level of the map, taking into account smooth transition between zoom-levels.
     * E.g., when zooming from zoom-level 4 to 5, this function returns an increasing value starting at 4 and ending
     * at 5, over time. The used zoomTransition can be set as an option.
     *
     * @return {Number} Zoom-level.
     */
    MapView.prototype.getZoom = function() {
        return this._cache.zoom;
    };

    /**
     * Get the position in pixels (relative to the left-top of the container) for the given geographical position.
     *
     * @param {LatLng} position in geographical coordinates.
     * @return {Point} Position in pixels, relative to the left-top of the mapView.
     */
    MapView.prototype.pointFromPosition = function(position) {
        switch (this.mapType) {
        case MapType.GOOGLEMAPS:
            if (!(position instanceof google.maps.LatLng)) {
                position = new google.maps.LatLng(MapUtility.lat(position), MapUtility.lng(position), true);
            }
            var worldPoint = this.map.getProjection().fromLatLngToPoint(position);
            return {
                x: (worldPoint.x - this._cache.bottomLeft.x) * this._cache.scale,
                y: (worldPoint.y - this._cache.topRight.y) * this._cache.scale
            };
        case MapType.LEAFLET:
            // Note: smooth zooming is not yet supported for leaflet
            var pnt = this.map.latLngToContainerPoint(position);
            return pnt;
        }
    };

    /**
     * Get the geographical coordinates for a given position in pixels (relative to the left-top of the container).
     *
     * @param {Point} point Position in pixels, relative to the left-top of the mapView.
     * @return {LatLng} Position in geographical coordinates.
     */
    MapView.prototype.positionFromPoint = function(point) {
        switch (this.mapType) {
        case MapType.GOOGLEMAPS:
            var worldPoint = new google.maps.Point(
                (point.x / this._cache.scale) + this._cache.bottomLeft.x,
                (point.y / this._cache.scale) + this._cache.topRight.y
            );
            return this.map.getProjection().fromPointToLatLng(worldPoint);
        case MapType.LEAFLET:
            // Note: smooth zooming is not yet supported for leaflet
            return this.map.containerPointToLatLng(point);
        }
    };

    /**
     * Get the size of the map-view in pixels.
     *
     * @return {Array.Number} Size of the mapView.
     */
    MapView.prototype.getSize = function() {
        return this._cache.size;
    };

    /**
     * Halts any pending transitions.
     */
    MapView.prototype.halt = function() {
        this._position.halt();
        this._positionInvalidated = true;
    };

    /**
     * Is there at least one action pending completion?
     *
     * @return {Bool} True when there are active transitions running.
     */
    MapView.prototype.isActive = function() {
        return this._position.isActive();
    };

    /**
     * @private
     * @ignore
     */
    MapView.prototype._updateCache = function(zoom, northEast, southWest) {

        // Store final data
        this._cache.finalZoom = zoom;
        this._cache.finalScale = Math.pow(2, this._cache.finalZoom);
        this._cache.finalNorthEast = northEast;
        this._cache.finalSouthWest = southWest;

        // Calculate size of the MapView
        switch (this.mapType) {
        case MapType.GOOGLEMAPS:

            if (!(northEast instanceof google.maps.LatLng)) {
                northEast = new google.maps.LatLng(MapUtility.lat(northEast), MapUtility.lng(northEast), true);
            }
            if (!(southWest instanceof google.maps.LatLng)) {
                southWest = new google.maps.LatLng(MapUtility.lat(southWest), MapUtility.lng(southWest), true);
            }

            var topRight = this.map.getProjection().fromLatLngToPoint(northEast);
            var bottomLeft = this.map.getProjection().fromLatLngToPoint(southWest);
            this._cache.size = [
                (topRight.x - bottomLeft.x) * this._cache.finalScale,
                (bottomLeft.y - topRight.y) * this._cache.finalScale
            ];
            break;
        case MapType.LEAFLET:
            var point = this.map.getSize();
            this._cache.size = [point.x, point.y];
            break;
        }

        // Calculate current world point edges and scale
        switch (this.mapType) {
        case MapType.GOOGLEMAPS:

            northEast = this._zoom.northEast.get();
            southWest = this._zoom.southWest.get();
            if (!(northEast instanceof google.maps.LatLng)) {
                northEast = new google.maps.LatLng(MapUtility.lat(northEast), MapUtility.lng(northEast), true);
            }
            if (!(southWest instanceof google.maps.LatLng)) {
                southWest = new google.maps.LatLng(MapUtility.lat(southWest), MapUtility.lng(southWest), true);
            }

            this._cache.topRight = this.map.getProjection().fromLatLngToPoint(northEast);
            this._cache.bottomLeft = this.map.getProjection().fromLatLngToPoint(southWest);
            this._cache.scale = this._cache.size[0] / (this._cache.topRight.x - this._cache.bottomLeft.x);
            this._cache.zoom = Math.log(this._cache.scale) / Math.log(2);
            break;
        case MapType.LEAFLET:

            // Note: smooth zooming is not yet supported for leaflet
            this._cache.zoom = zoom;
            break;
        }
    };

    /**
     * Get map-information from the underlying map-provider, such as position, bounds, zoom-level...
     *
     * @private
     * @ignore
     */
    MapView.prototype._getMapInfo = function() {
        var bounds;
        var northEast;
        var southWest;
        var center;
        var zoom;
        switch (this.mapType) {
        case MapType.GOOGLEMAPS:

            // map.getBounds() returns the northEast and southWest in wrapped coordinates (between -180..180).
            // This makes it difficult to create a linear coordinate space for converting world-coordinates
            // into pixels. This function therefore 'unwraps' the northEast and southWest coordinates using
            // * map.getCenter() (which does return unwrapped coordinates).
            bounds = this.map.getBounds();
            center = this.map.getCenter();
            zoom = this.map.getZoom();

            var centerLng = MapUtility.lng(center);

            northEast = bounds.getNorthEast();
            var northEastLng = northEast.lng();
            while (northEastLng < centerLng) {
                northEastLng += 360;
            }
            while (northEastLng > (centerLng + 360)) {
                northEastLng -= 360;
            }

            southWest = bounds.getSouthWest();
            var southWestLng = southWest.lng();
            while (southWestLng < (centerLng - 360)) {
                southWestLng += 360;
            }
            while (southWestLng > centerLng) {
                southWestLng -= 360;
            }

            return {
                zoom: zoom,
                center: {lat: center.lat(), lng: center.lng()},
                southWest: {lat: southWest.lat(), lng: southWestLng},
                northEast: {lat: northEast.lat(), lng: northEastLng}
            };
        case MapType.LEAFLET:
            bounds = this.map.getBounds();
            southWest = bounds.getSouthWest();
            northEast = bounds.getNorthEast();
            center = this.map.getCenter();
            zoom = this.map.getZoom();
            return {
                zoom: zoom,
                center: {lat: center.lat, lng: center.lng},
                southWest: {lat: southWest.lat, lng: southWest.lng},
                northEast: {lat: northEast.lat, lng: northEast.lng}
            };
        }
    };

    /**
     * Renders the view.
     *
     * @private
     * @ignore
     */
    MapView.prototype.render = function render() {

        // Init the map (once)
        if (!this.map) {
            this._initMap();
        }
        if (this._initComplete) {

            // When the zoom-level is changed by the map, start a transition
            // that runs alongside.
            var options;
            var info = this._getMapInfo();
            var invalidateCache = false;
            if (info.zoom !== this._cache.finalZoom) {
                this._zoom.northEast.halt();
                this._zoom.southWest.halt();
                this._zoom.center.halt();
                this._zoom.northEast.set(info.northEast, this.options.zoomTransition);
                this._zoom.southWest.set(info.southWest, this.options.zoomTransition);
                this._zoom.center.set(info.center, this.options.zoomTransition);
                invalidateCache = true;
            } else if (!this._zoom.northEast.isActive()) {
                this._zoom.northEast.reset(info.northEast);
                this._zoom.southWest.reset(info.southWest);
                this._zoom.center.reset(info.center);
            }
            else {
                this._zoom.northEast.get(); // ensure that .get() always gets called to ensure that isActive() works
                invalidateCache = true;
            }

            // Update the cache
            if (invalidateCache || (info.zoom !== this._cache.finalZoom) ||
                    !MapUtility.equals(info.northEast, this._cache.finalNorthEast) ||
                    !MapUtility.equals(info.southWest, this._cache.finalSouthWest)) {
                //console.log('updating cache..');
                this._updateCache(info.zoom, info.northEast, info.southWest);
            }

            // Get/set map center
            if (this._position.isActive() || this._positionInvalidated) {
                options = {
                    center: this._position.get()
                };
                this._positionInvalidated = false;
            }
            else {
                this._position.reset(info.center);
            }
            if (options) {
                switch (this.mapType) {
                case MapType.GOOGLEMAPS:
                    this.map.setOptions(options);
                    break;
                case MapType.LEAFLET:
                    this.map.panTo(options.center, {animate: false});
                    break;
                }
            }
        }

        // Call super
        return this._node.render();
    };

    module.exports = MapView;
});
