/**
* This Source Code is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Hein Rutjes (IjzerenHein)
* @license MIT
* @copyright Gloey Apps, 2014/2015
*
* @library famous-map
* @version 0.3.2
* @generated 08-05-2015
*/
/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/**
 * This namespace holds standalone functionality.
 *
 * @module
 */
define('famous-map/MapUtility',['require','exports','module'],function(require, exports, module) {
    

    /**
     * @class
     * @alias module:MapUtility
     */
    var MapUtility = {};

    /**
     * Get the latitude from the position (LatLng) object.
     *
     * @param {LatLng} position Position
     * @return {Number} Latitude in degrees
     */
    MapUtility.lat = function lat(position) {
        if (position instanceof Array) {
            return position[0];
        }
        else if (position.lat instanceof Function) {
            return position.lat();
        }
        else {
            return position.lat;
        }
    };

    /**
     * Get the longitude from the position (LatLng) object.
     *
     * @param {LatLng} position Position
     * @return {Number} Longitude in degrees
     */
    MapUtility.lng = function lng(position) {
        if (position instanceof Array) {
            return position[1];
        }
        else if (position.lng instanceof Function) {
            return position.lng();
        }
        else {
            return position.lng;
        }
    };

    /**
     * Compares two positions for equality.
     *
     * @param {LatLng} position1 Position 1
     * @param {LatLng} position2 Position 2
     * @return {Boolean} Result of comparison
     */
    MapUtility.equals = function(position1, position2) {
        return (MapUtility.lat(position1) === MapUtility.lat(position2)) &&
               (MapUtility.lng(position1) === MapUtility.lng(position2));
    };

    /**
     * Converts degrees into radians (radians = degrees * (Math.PI / 180)).
     *
     * @param {Number} deg Degrees
     * @return {Number} radians.
     */
    MapUtility.radiansFromDegrees = function(deg) {
        return deg * (Math.PI / 180);
    };

    /**
     * Calculates the rotation-angle between two given positions.
     *
     * @param {LatLng} start Start position.
     * @param {LatLng} end End position.
     * @return {Number} Rotation in radians.
     */
    MapUtility.rotationFromPositions = function(start, end) {
        return Math.atan2(MapUtility.lng(start) - MapUtility.lng(end), MapUtility.lat(start) - MapUtility.lat(end)) + (Math.PI / 2.0);
    };

    /**
     * Calculates the distance between two positions in kilometers.
     *
     * @param {LatLng} start Starting position
     * @param {LatLng} end End position
     * @return {Number} Distance in km
     */
    MapUtility.distanceBetweenPositions = function(start, end) {

        // Taken from: http://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371; // earths radius in km
        var lat1 = MapUtility.radiansFromDegrees(MapUtility.lat(start));
        var lat2 = MapUtility.radiansFromDegrees(MapUtility.lat(end));
        var deltaLat = MapUtility.radiansFromDegrees(MapUtility.lat(end) - MapUtility.lat(start));
        var deltaLng = MapUtility.radiansFromDegrees(MapUtility.lng(end) - MapUtility.lng(start));

        var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;
        return d;
    };

    module.exports = MapUtility;
});

/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/**
 * The MapPositionTransitionable makes it possible to transition between two geographical
 * positions. Currently, only standard transition definitions are supported (see `Transitionable`), but in the future more interesting
 * transitions may be added.
 *
 * *This class is used internally by `MapView` and `MapStateModifier`.*
 *
 * @module
 */
define('famous-map/MapPositionTransitionable',['require','exports','module','famous/transitions/Transitionable','./MapUtility'],function(require, exports, module) {
    

    // import dependencies
    var Transitionable = require('famous/transitions/Transitionable');
    var MapUtility = require('./MapUtility');

    /**
     * @class
     * @param {LatLng} [position] Default geopgraphical position
     * @alias module:MapPositionTransitionable
     */
    function MapPositionTransitionable(position) {
        this.position = new Transitionable([0, 0]);
        if (position) {
            this.set(position);
        }
    }

    /**
     * Sets the default transition to use for transitioning between position states.
     *
     * @param  {Object} transition Transition definition
     */
    MapPositionTransitionable.prototype.setDefaultTransition = function setDefaultTransition(transition) {
        this.position.setDefault(transition);
    };

    /**
     * Cancel all transitions and reset to a geographical position.
     *
     * @param {LatLng} position
     */
    MapPositionTransitionable.prototype.reset = function reset(position) {
        var latlng = [MapUtility.lat(position), MapUtility.lng(position)];
        this.position.reset(latlng);
        this._final = position;
    };

    /**
     * Set the geographical position by adding it to the queue of transition.
     *
     * @param {LatLng} position
     * @param {Object} [transition] Transition definition
     * @param {Function} [callback] Callback
     */
    MapPositionTransitionable.prototype.set = function set(position, transition, callback) {
        var latlng = [MapUtility.lat(position), MapUtility.lng(position)];
        this.position.set(latlng, transition, callback);
        this._final = position;
        return this;
    };

    /**
     * Get the current geographical position.
     *
     * @return {LatLng}
     */
    MapPositionTransitionable.prototype.get = function get() {
        if (this.isActive()) {
            var latlng = this.position.get();
            return {
                lat: latlng[0],
                lng: latlng[1]
            };
        }
        else {
            return this._final;
        }
    };

    /**
     * Get the destination geographical position.
     *
     * @return {LatLng}
     */
    MapPositionTransitionable.prototype.getFinal = function getFinal() {
        return this._final;
    };

    /**
     * Determine if the transitionable is currently transitioning
     *
     * @return {Boolean}
     */
    MapPositionTransitionable.prototype.isActive = function isActive() {
        return this.position.isActive();
    };

    /**
     * Halts the transition
     */
    MapPositionTransitionable.prototype.halt = function halt() {
        this._final = this.get();
        this.position.halt();
    };

    module.exports = MapPositionTransitionable;
});

/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/**
 * MapTransitions can transition between geographical positions using specific speed (e.g. 50 km/h).
 *
 * @module
 */
define('famous-map/MapTransition',['require','exports','module','./MapUtility'],function(require, exports, module) {
    

    // import dependencies
    var MapUtility = require('./MapUtility');

    /**
     * @class
     * @alias module:MapTransition
     */
    function MapTransition() {

        this.state = undefined;

        this._startTime = 0;
        this._startState = 0;
        this._updateTime = 0;
        this._endState = 0;
        this._active = false;
        this._duration = 0;
        this._distance = 0;
        this._callback = undefined;
    }

    MapTransition.SUPPORTS_MULTIPLE = 2;

    /**
     * @property DEFAULT_OPTIONS
     * @protected
     */
    MapTransition.DEFAULT_OPTIONS = {

        /**
         * The speed of the transition in mph.
         */
        speed: 1000 // mph
    };

    // Interpolate: If a linear function f(0) = a, f(1) = b, then return f(t)
    function _interpolate(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }
    function _clone(obj) {
        return obj.slice(0);
    }

    /**
     * Resets the position
     *
     * @param {Array.Number} state Array: [lat, lng]
     */
    MapTransition.prototype.reset = function reset(state) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }

        this.state = _clone(state);

        this._startTime = 0;
        this._updateTime = 0;
        this._startState = this.state;
        this._endState = this.state;
        this._duration = 0;
        this._distance = 0;
        this._active = false;
    };

    /**
     * Set the end position and transition, with optional callback on completion.
     *
     * @param {Array.Number} state Array: [lat,lng]
     * @param {Object} [transition] Transition definition
     * @param {Function} [callback] Callback
     */
    MapTransition.prototype.set = function set(state, transition, callback) {

        if (!transition) {
            this.reset(state);
            if (callback) {
                callback();
            }
            return;
        }

        this._speed = MapTransition.DEFAULT_OPTIONS.speed;
        if (transition && transition.speed) {
            this._speed = transition.speed;
        }

        this._startState = this.get();
        this._startTime = Date.now();
        this._endState = _clone(state);
        this._active = true;
        this._callback = callback;
        this._distance = MapUtility.distanceBetweenPositions(this._startState, this._endState);
        this._duration = (this._distance / this._speed) * (60 * 60 * 1000);
        //console.log('distance: ' + this._distance + ' km, speed: ' + transition.speed + 'km/h, duration:' + this._duration + ' ms');
    };

    /**
     * Get the current position of the transition.
     *
     * @param {Date} [timestamp] Timestamp at which to get the position
     * @return {Array.Number} Array: [lat, lng]
     */
    MapTransition.prototype.get = function get(timestamp) {
        if (!this._active) {
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }
            return this.state;
        }

        if (!timestamp) {
            timestamp = Date.now();
        }
        if (this._updateTime >= timestamp) {
            return this.state;
        }
        this._updateTime = timestamp;

        var timeSinceStart = timestamp - this._startTime;
        if (timeSinceStart >= this._duration) {
            this.state = this._endState;
            this._active = false;
        }
        else if (timeSinceStart < 0) {
            this.state = this._startState;
        }
        else {
            var t = timeSinceStart / this._duration;
            var lat = _interpolate(this._startState[0], this._endState[0], t);
            var lng = _interpolate(this._startState[1], this._endState[1], t);
            this.state = [lat, lng];
        }

        return this.state;
    };

    /**
     * Detects whether a transition is in progress
     *
     * @return {Boolean}
     */
    MapTransition.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt the transition
     */
    MapTransition.prototype.halt = function halt() {
        this.set(this.get());
    };

    module.exports = MapTransition;
});

/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014/2015
 */

/*global google, L, ol, mapboxgl*/

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
 * |MapType.MAPBOXGL|Mapbox GL|
 * @module
 */
define('famous-map/MapView',['require','exports','module','famous/core/Surface','famous/views/SizeAwareView','famous/transitions/Transitionable','./MapUtility','./MapPositionTransitionable','./MapTransition'],function(require, exports, module) {
    

    // import dependencies
    var Surface = require('famous/core/Surface');
    var SizeAwareView = require('famous/views/SizeAwareView');
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
        OPENLAYERS3: 3,
        MAPBOXGL: 4
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
        SizeAwareView.apply(this, arguments);

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
    MapView.prototype = Object.create(SizeAwareView.prototype);
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
        var options;
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

        // Create open layers 3 Map
        case MapType.OPENLAYERS3:
            options = this.options.mapOptions;
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

        // Create mapbox GL Map
        case MapType.MAPBOXGL:
            options = {};
            for (var key in this.options.mapOptions) {
                options[key] = this.options.mapOptions[key];
            }
            options.container = elm;
            this.map = new mapboxgl.Map(options);
            this._initComplete = true;
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
        case MapType.MAPBOXGL:
            return (this.map.getBearing() * Math.PI) / -180;
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
        case MapType.MAPBOXGL:
            return this.map.project([MapUtility.lat(position), MapUtility.lng(position)]);
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
        case MapType.MAPBOXGL:
            return this.map.unproject(point);
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
        case MapType.MAPBOXGL:
            this._cache.size = this.getParentSize();
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
        case MapType.MAPBOXGL:

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
        case MapType.MAPBOXGL:
            bounds = this.map.getBounds();
            return {
                zoom: this.map.getZoom(),
                center: this.map.getCenter(),
                southWest: bounds.getSouthWest(),
                northEast: bounds.getNorthEast(),
                rotation: (this.map.getBearing() * Math.PI) / -180
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
                case MapType.MAPBOXGL:
                    this.map.setCenter([MapUtility.lat(options.center), MapUtility.lng(options.center)]);
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

/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/**
 * The MapModifier makes it possible to link renderables to a geopgraphical position on a `MapView`.
 * Additionally it adds functionality for rotating and zooming renderables, and possibly all kinds of future  map-related transformations.
 * Use `MapStateModifier` if you want to use transitions, e.g. to animate a move from one geographical position to another.
 *
 * @module
 */
define('famous-map/MapModifier',['require','exports','module','famous/core/Transform','./MapUtility'],function(require, exports, module) {
    

    // import dependencies
    var Transform = require('famous/core/Transform');
    var MapUtility = require('./MapUtility');

    /**
     * @class
     * @param {Object} options Options.
     * @param {MapView} options.mapView The MapView.
     * @param {LatLng} [options.position] Initial geographical coordinates.
     * @param {LatLng} [options.offset] Displacement offset in geographical coordinates from the position.
     * @param {LatLng | object | function} [options.rotateTowards] Position to rotate the renderables towards.
     * @param {number} [options.zoomBase] Base zoom-level at which the renderables are displayed in their true size.
     * @param {number | function} [options.zoomScale] Customer zoom-scaling factor or function.
     * @alias module:MapModifier
     */
    function MapModifier(options) {

        this.mapView = options.mapView;

        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            target: null
        };

        this._cache = {};

        this._positionGetter = null;
        this._rotateTowardsGetter = null;
        this._offset = options.offset;
        this._zoomScale = options.zoomScale;
        this._zoomBase = options.zoomBase;

        if (options.position) {
            this.positionFrom(options.position);
        }
        if (options.rotateTowards) {
            this.rotateTowardsFrom(options.rotateTowards);
        }
    }

    /**
     * Set the geographical position of the renderables.
     *
     * @param {LatLng|Function|Object} position Position in geographical coordinates.
     */
    MapModifier.prototype.positionFrom = function(position) {
        if (!position) {
            this._positionGetter = null;
            this._position = null;
        }
        else if (position instanceof Function) {
            this._positionGetter = position;
        }
        else if (position instanceof Object && position.getPosition) {
            this._positionGetter = position.getPosition.bind(position);
        }
        else {
            this._positionGetter = null;
            this._position = position;
        }
        return this;
    };

    /**
     * Set the geographical position to rotate the renderables towards.
     * The child renderables are assumed to be rotated to the right by default.
     * To change the base rotation, add a rotation-transform to the renderable, like this:
     * `new Modifier({transform: Transform.rotateZ(Math.PI/2)})`
     *
     * @param {LatLng} position Geographical position to rotate towards.
     */
    MapModifier.prototype.rotateTowardsFrom = function(position) {
        if (!position) {
            this._rotateTowardsGetter = null;
            this._rotateTowards = null;
        }
        else if (position instanceof Function) {
            this._rotateTowardsGetter = position;
        }
        else if (position instanceof Object && position.getPosition) {
            this._rotateTowardsGetter = position.getPosition.bind(position);
        }
        else {
            this._rotateTowardsGetter = null;
            this._rotateTowards = position;
        }
        return this;
    };

    /**
     * Set the base zoom-level. When set, auto-zooming is effectively enabled.
     * The renderables are then displayed in their true size when the map zoom-level equals zoomBase.
     *
     * @param {Number} zoomBase Map zoom-level
     */
    MapModifier.prototype.zoomBaseFrom = function(zoomBase) {
        this._zoomBase = zoomBase;
        return this;
    };

    /**
     * Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and
     * decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
     * a scale-factor, with the following signature: function (zoomBase, zoomCurrent).
     *
     * @param {Number|Function} zoomScale Zoom-scale factor or function.
     */
    MapModifier.prototype.zoomScaleFrom = function(zoomScale) {
        this._zoomScale = zoomScale;
        return this;
    };

    /**
     * Set the displacement offset in geographical coordinates.
     *
     * @param {LatLng} offset Displacement offset in geographical coordinates.
     */
    MapModifier.prototype.offsetFrom = function(offset) {
        this._offset = offset;
        return this;
    };

    /**
     * Get the current geographical position.
     *
     * @return {LatLng} Position in geographical coordinates.
     */
    MapModifier.prototype.getPosition = function() {
        return this._positionGetter || this._position;
    };

    /**
     * Get the geographical position towards which the renderables are rotated.
     *
     * @return {LatLng} Geographical position towards which renderables are rotated.
     */
    MapModifier.prototype.getRotateTowards = function() {
        return this._rotateTowardsGetter || this._rotateTowards;
    };

    /**
     * Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
     * displayed in their true size.
     *
     * @return {Number} Base zoom level
     */
    MapModifier.prototype.getZoomBase = function() {
        return this._zoomBase;
    };

    /**
     * Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
     * a scale-factor.
     *
     * @return {Number|Function} Zoom-scale
     */
    MapModifier.prototype.getZoomScale = function() {
        return this._zoomScale;
    };

    /**
     * Get the geographical displacement offset.
     *
     * @return {LatLng} Offset in geographical coordinates.
     */
    MapModifier.prototype.getOffset = function() {
        return this._offset;
    };

    /**
     * Return render spec for this MapModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @ignore
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this MapModifier, including the
     *    provided target
     */
    MapModifier.prototype.modify = function modify(target) {
        if (!this.mapView.isInitialized()) {
            this._output.target = target;
            return this._output;
        }
        var cacheInvalidated = false;

        // Calculate scale transform
        if (this._zoomBase !== undefined) {
            var scaling;
            if (this._zoomScale) {
                if (this._zoomScale instanceof Function) {
                    scaling = this._zoomScale(this._zoomBase, this.mapView.getZoom());
                }
                else {
                    var zoom = (this.mapView.getZoom() - this._zoomBase) + 1;
                    if (zoom < 0) {
                        scaling = (1 / (Math.abs(zoom) + 1)) * this._zoomScale;
                    }
                    else {
                        scaling = (1 + zoom) * this._zoomScale;
                    }
                }
            }
            else {
                scaling = Math.pow(2, this.mapView.getZoom() - this._zoomBase);
            }
            if (this._cache.scaling !== scaling) {
                this._cache.scaling = scaling;
                this._cache.scale = Transform.scale(scaling, scaling, 1.0);
                cacheInvalidated = true;
            }
        }
        else if (this._cache.scale) {
            this._cache.scale = null;
            this._cache.scaling = null;
            cacheInvalidated = true;
        }

        // Move, rotate, etc... based on position
        var position = this._positionGetter ? this._positionGetter() : this._position;
        if (position) {

            // Offset position
            if (this._offset) {
                position = {
                    lat: MapUtility.lat(position) + MapUtility.lat(this._offset),
                    lng: MapUtility.lng(position) + MapUtility.lng(this._offset)
                };
            }

            // Calculate rotation transform
            var rotateTowards = this._rotateTowardsGetter ? this._rotateTowardsGetter() : this._rotateTowards;
            if (rotateTowards) {
                var rotation = MapUtility.rotationFromPositions(position, rotateTowards);
                rotation += this.mapView.getRotation();
                if (this._cache.rotation !== rotation) {
                    this._cache.rotation = rotation;
                    this._cache.rotate = Transform.rotateZ(rotation);
                    cacheInvalidated = true;
                }
            }
            else if (this._cache.rotate) {
                this._cache.rotate = null;
                this._cache.rotation = null;
                cacheInvalidated = true;
            }

            // Calculate translation transform
            var point = this.mapView.pointFromPosition(position);
            if (!this._cache.point || (point.x !== this._cache.point.x) || (point.y !== this._cache.point.y)) {
                this._cache.point = point;
                this._cache.translate = Transform.translate(point.x, point.y, 0);
                cacheInvalidated = true;
            }
        }
        else if (this._cache.translate) {
            this._cache.point = null;
            this._cache.translate = null;
            cacheInvalidated = true;
        }

        // Update transformation matrix
        if (cacheInvalidated) {
            var transform = this._cache.scale;
            if (this._cache.rotate) {
                transform = transform ? Transform.multiply(this._cache.rotate, transform) : this._cache.rotate;
            }
            if (this._cache.translate) {
                transform = transform ? Transform.multiply(this._cache.translate, transform) : this._cache.translate;
            }
            this._output.transform = transform;
        }

        this._output.target = target;
        return this._output;
    };

    module.exports = MapModifier;
});

/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/**
 * The MapStateModifier makes it possible to use transitions to e.g. move a renderable from one geographical
 * position to another. If the renderable doesn't require transitions, the use of the lightweight
 * and stateless `MapModifier` is strongly preferred.
 *
 * @module
*/
define('famous-map/MapStateModifier',['require','exports','module','./MapModifier','./MapPositionTransitionable'],function(require, exports, module) {
    

    // import dependencies
    var MapModifier = require('./MapModifier');
    var MapPositionTransitionable = require('./MapPositionTransitionable');

    /**
     * @class
     * @param {Object} options Options.
     * @param {MapView} options.mapView The MapView.
     * @param {LatLng} [options.position] Initial geographical coordinates.
     * @param {LatLng} [options.offset] Displacement offset in geographical coordinates from the position.
     * @param {LatLng} [options.rotateTowards] Position to rotate the renderables towards.
     * @param {number} [options.zoomBase] Base zoom-level at which the renderables are displayed in their true size.
     * @param {number|function} [options.zoomScale] Custom zoom-scaling factor or function.
     * @alias module:MapStateModifier
     */
    function MapStateModifier(options) {
        this.mapView = options.mapView;
        this._positionState = new MapPositionTransitionable(options.position);
        this._rotateTowardsState = new MapPositionTransitionable(options.rotateTowards);

        this._modifier = new MapModifier({
            mapView: this.mapView
        });

        if (options.position) {
            this.setPosition(options.position);
        }
        if (options.rotateTowards) {
            this.rotateTowards(options.rotateTowards);
        }
        if (options.offset) {
            this.setOffset(options.offset);
        }
        if (options.zoomBase !== undefined) {
            this.setZoomBase(options.zoomBase);
        }
        if (options.zoomScale) {
            this.setZoomScale(options.zoomScale);
        }
    }

    /**
     * Set the geographical position of the renderables, by adding the new position to the chain of transitions.
     *
     * @param {LatLng} position New position in geographical coordinates (Latitude, Longitude).
     * @param {Transition} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapStateModifier.prototype.setPosition = function(position, transition, callback) {
        this._positionState.set(position, transition, callback);
        return this;
    };

    /**
     * Set the destination geographical position to rotate the renderables towards, by adding them.
     * to the chain of transitions.
     * The child renderables are assumed to be rotated to the right by default.
     * To change the base rotation, add a rotation-transform to the renderable, like this:
     * `new Modifier({transform: Transform.rotateZ(Math.PI/2)})`
     *
     * @param {LatLng} position Destination position in geographical position to rotate towards.
     * @param {Transition} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapStateModifier.prototype.rotateTowards = function(position, transition, callback) {
        this._rotateTowardsState.set(position, transition, callback);
    };

    /**
     * Set the base zoom-level. When set, auto-zooming is effectively enabled.
     * The renderables are then displayed in their true size when the map zoom-level equals zoomBase.
     *
     * @param {Number} zoomBase Map zoom-level
     */
    MapStateModifier.prototype.setZoomBase = function(zoomBase) {
        this._modifier.zoomBaseFrom(zoomBase);
        return this;
    };

    /**
     * Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and
     * decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
     * a scale-factor, with the following signature: function (zoomBase, zoomCurrent).
     *
     * @param {Number|Function} zoomScale Zoom-scale factor or function.
     */
    MapStateModifier.prototype.setZoomScale = function(zoomScale) {
        this._modifier.zoomScaleFrom(zoomScale);
        return this;
    };

    /**
     * Set the displacement offset in geographical coordinates.
     *
     * @param {LatLng} offset Displacement offset in geographical coordinates.
     */
    MapStateModifier.prototype.setOffset = function(offset) {
        this._modifier.offsetFrom(offset);
        return this;
    };

    /**
     * Get the current geographical position.
     *
     * @return {LatLng} Position in geographical coordinates.
     */
    MapStateModifier.prototype.getPosition = function() {
        return this._positionState.get();
    };

    /**
     * Get the geographical position towards which the renderables are currently rotated.
     *
     * @return {LatLng} Destination geographical position towards which renderables are rotated.
     */
    MapStateModifier.prototype.getRotateTowards = function() {
        return this._rotateTowardsState.get();
    };

    /**
     * Get the destination geographical position.
     *
     * @return {LatLng} Position in geographical coordinates.
     */
    MapStateModifier.prototype.getFinalPosition = function() {
        return this._positionState.getFinal();
    };

    /**
     * Get the destination geographical position which the renderables should be rotated towards.
     *
     * @return {LatLng} Position in geographical coordinates.
     */
    MapStateModifier.prototype.getFinalRotateTowards = function() {
        return this._rotateTowardsState.getFinal();
    };

    /**
     * Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
     * displayed in their true size.
     *
     * @return {Number} Base zoom level
     */
    MapStateModifier.prototype.getZoomBase = function() {
        return this._modifier.getZoomBase();
    };

    /**
     * Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
     * a scale-factor.
     *
     * @return {Number|Function} Zoom-scale
     */
    MapStateModifier.prototype.getZoomScale = function() {
        return this._modifier.getZoomScale();
    };

     /**
     * Get the geographical displacement offset.
     *
     * @return {LatLng} Offset in geographical coordinates.
     */
    MapStateModifier.prototype.getOffset = function() {
        return this._modifier.getOffset();
    };

    /**
     * Halts any pending transitions.
     */
    MapStateModifier.prototype.halt = function() {
        this._positionState.halt();
        this._rotateTowardsState.halt();
    };

    /**
     * Is there at least one transition pending completion?
     *
     * @return {Bool} True when there are active transitions running.
     */
    MapStateModifier.prototype.isActive = function() {
        return this._positionState.isActive() || this._rotateTowardsState.isActive();
    };

    /**
     * Return render spec for this MapStateModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @ignore
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this MapStateModifier, including the
     *    provided target
     */
    MapStateModifier.prototype.modify = function modify(target) {
        this._modifier.positionFrom(this._positionState.get());
        this._modifier.rotateTowardsFrom(this._rotateTowardsState.getFinal());
        return this._modifier.modify(target);
    };

    module.exports = MapStateModifier;
});

define('template.js',['require','famous-map/MapView','famous-map/MapModifier','famous-map/MapStateModifier','famous-map/MapTransition','famous-map/MapPositionTransitionable','famous-map/MapUtility'],function(require) {
    require('famous-map/MapView');
    require('famous-map/MapModifier');
    require('famous-map/MapStateModifier');
    require('famous-map/MapTransition');
    require('famous-map/MapPositionTransitionable');
    require('famous-map/MapUtility');
});

