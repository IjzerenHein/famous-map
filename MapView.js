/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014/2015
 */

/*global google, L, ol*/

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
 * |MapType.GOOGLEMAPS (default)|Google-maps|
 * |MapType.LEAFLET|Leaflet.js|
 * |MapType.OPENLAYERS3|Open layers 3|
 * @module
 */
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
    var globalMapViewId = 1;

    /*
     * Map-type
     * @enum {Number}
     * @alias module:MapView.MapType
     */
    var MapType = {
        GOOGLEMAPS: 1,
        LEAFLET: 2,
        OPENLAYERS3: 3
    };

    /**
     * @class
     * @param {Object} options Options.
     * @param {MapType} options.type Map-type (e.g. MapView.MapType.GOOGLEMAPS, MapView.MapType.LEAFLET, MapView.MapType.OPENLAYERS3).
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
            this.mapId = 'MapView' + globalMapViewId;
            globalMapViewId++;

            // Insert div into the DOM
            var surface = new Surface({
                classes: ['mapview', 'fm-mapview'], // mapview is included for backwards compat
                content: '<div id="' + this.mapId + '" style="width: 100%; height: 100%;"></div>',
                size: [undefined, undefined]
            });
            this.add(surface);
            this._surface = surface;
        }
    }
    MapView.prototype = Object.create(View.prototype);
    MapView.prototype.constructor = MapView;
    MapView.MapType = MapType;

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
                this._initComplete = true;
            }.bind(this));
            break;

        // Create leaflet Map
        case MapType.LEAFLET:
            this.map = L.map(elm, this.options.mapOptions);
            this._initComplete = true;
            break;

        // Create ol3 Map
        case MapType.OPENLAYERS3:
            var options = this.options.mapOptions;
            var center = options.center;
            this.map = new ol.Map({
                target: elm,
                controls: ol.control.defaults({attributionOptions: {collapsible: false}}),
                view: new ol.View({
                    center: ol.proj.transform([MapUtility.lng(center), MapUtility.lat(center)], 'EPSG:4326', 'EPSG:3857'),
                    zoom: options.zoom
                })
            });
            this._surface.on('resize', function() {
                this.map.updateSize();
            }.bind(this));
            // When famo.us removes the OpenLayers div from the DOM, the canvas gets
            // hidden and is not restored to its visible state when shown again.
            // The following code, calls 'updateSize' whenever famo.us re-deploys
            // the surface to the DOM, fixing this issue.
            this._surface.on('deploy', function() {
                if (this._initComplete) {
                    this.map.updateSize();
                }
            }.bind(this));
            this.map.once('postrender', function() {
                this._initComplete = true;
            }.bind(this));
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
     * Returns `true` when the map-view has been fully initialized.
     *
     * @return {Bool} true/false.
     */
    MapView.prototype.isInitialized = function() {
        return this._initComplete && this._loadEventEmitted;
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
     * Get the rotation of the map. 0 means north-up.
     * @return {Number} Rotation in radians.
     */
    MapView.prototype.getRotation = function() {
        switch (this.mapType) {
        case MapType.GOOGLEMAPS:
        case MapType.LEAFLET:
            return 0;
        case MapType.OPENLAYERS3:
            return this.map.getView().getRotation();
        }
    };

    /**
     * Get the position in pixels (relative to the left-top of the container) for the given geographical position.
     *
     * @param {LatLng} position in geographical coordinates.
     * @return {Point} Position in pixels, relative to the left-top of the mapView.
     */
    MapView.prototype.pointFromPosition = function(position) {
        var pnt;
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
            pnt = this.map.latLngToContainerPoint(position);
            return pnt;
        case MapType.OPENLAYERS3:
            // Note: updates during map interaction are not yet supported
            pnt = this.map.getPixelFromCoordinate(ol.proj.transform([MapUtility.lng(position), MapUtility.lat(position)], 'EPSG:4326', 'EPSG:3857'));
            return {x: pnt[0], y: pnt[1]};
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
        case MapType.OPENLAYERS3:
            // Note: updates during map interaction are not yet supported
            var lonLat = ol.proj.transform(this.map.getCoordinateFromPixel([point.x, point.y]), 'EPSG:3857', 'EPSG:4326');
            return {lat: lonLat[1], lng: lonLat[0]};
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
        case MapType.OPENLAYERS3:
            this._cache.size = this.map.getSize();
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
        case MapType.OPENLAYERS3:

            // Note: smooth zooming is not yet supported for leaflet, and
            // updates during map interaction are not yet supported for ol3
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
        case MapType.OPENLAYERS3:
            var view = this.map.getView();
            bounds = ol.proj.transformExtent(view.calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326');
            center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
            zoom = view.getZoom();
            return {
                zoom: zoom,
                center: {lat: center[1], lng: center[0]},
                southWest: {lat: bounds[1], lng: bounds[0]},
                northEast: {lat: bounds[3], lng: bounds[2]},
                rotation: view.getRotation()
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
            }
            else if (!this._zoom.northEast.isActive()) {
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
                case MapType.OPENLAYERS3:
                    this.map.getView().setCenter(ol.proj.transform([MapUtility.lng(options.center), MapUtility.lat(options.center)], 'EPSG:4326', 'EPSG:3857'));
                    break;
                }
            }
            if (!this._loadEventEmitted) {
                this._loadEventEmitted = true;
                this._eventOutput.emit('load', this);
            }
        }

        // Call super
        return this._node.render();
    };

    /**
     * Helper function that checks whether the given DOM element
     * is a child of a MapView.
     */
    function _elementIsChildOfMapView(element) {
        if (element.className.indexOf('fm-mapview') >= 0) {
            return true;
        }
        return element.parentElement ? _elementIsChildOfMapView(element.parentElement) : false;
    }

    /**
     * Installs the selective touch-move handler so that Google Maps
     * can be correctly used with touch events (mobile).
     *
     * Install this handler before creating the main Context:
     * ```javascript
     * var Engine = require('famous/core/Engine');
     * var MapView = require('famous-map/MapView');
     * var isMobile = require('ismobilejs');
     *
     * if (isMobile.any) {
     *   Engine.setOptions({appMode: false});
     *   MapView.installSelectiveTouchMoveHandler();
     * }
     *
     * var mainContext = Engine.createContext();
     * ...
     * ```
     */
    MapView.installSelectiveTouchMoveHandler = function() {
        window.addEventListener('touchmove', function(event) {
            if (!_elementIsChildOfMapView(event.target)) {
                event.preventDefault();
            }
        });
    };

    module.exports = MapView;
});
