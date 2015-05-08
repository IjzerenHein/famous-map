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
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';
var Transform = typeof window !== 'undefined' ? window.famous.core.Transform : typeof global !== 'undefined' ? global.famous.core.Transform : null;
var MapUtility = require('./MapUtility');
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
MapModifier.prototype.positionFrom = function (position) {
    if (!position) {
        this._positionGetter = null;
        this._position = null;
    } else if (position instanceof Function) {
        this._positionGetter = position;
    } else if (position instanceof Object && position.getPosition) {
        this._positionGetter = position.getPosition.bind(position);
    } else {
        this._positionGetter = null;
        this._position = position;
    }
    return this;
};
MapModifier.prototype.rotateTowardsFrom = function (position) {
    if (!position) {
        this._rotateTowardsGetter = null;
        this._rotateTowards = null;
    } else if (position instanceof Function) {
        this._rotateTowardsGetter = position;
    } else if (position instanceof Object && position.getPosition) {
        this._rotateTowardsGetter = position.getPosition.bind(position);
    } else {
        this._rotateTowardsGetter = null;
        this._rotateTowards = position;
    }
    return this;
};
MapModifier.prototype.zoomBaseFrom = function (zoomBase) {
    this._zoomBase = zoomBase;
    return this;
};
MapModifier.prototype.zoomScaleFrom = function (zoomScale) {
    this._zoomScale = zoomScale;
    return this;
};
MapModifier.prototype.offsetFrom = function (offset) {
    this._offset = offset;
    return this;
};
MapModifier.prototype.getPosition = function () {
    return this._positionGetter || this._position;
};
MapModifier.prototype.getRotateTowards = function () {
    return this._rotateTowardsGetter || this._rotateTowards;
};
MapModifier.prototype.getZoomBase = function () {
    return this._zoomBase;
};
MapModifier.prototype.getZoomScale = function () {
    return this._zoomScale;
};
MapModifier.prototype.getOffset = function () {
    return this._offset;
};
MapModifier.prototype.modify = function modify(target) {
    if (!this.mapView.isInitialized()) {
        this._output.target = target;
        return this._output;
    }
    var cacheInvalidated = false;
    if (this._zoomBase !== undefined) {
        var scaling;
        if (this._zoomScale) {
            if (this._zoomScale instanceof Function) {
                scaling = this._zoomScale(this._zoomBase, this.mapView.getZoom());
            } else {
                var zoom = this.mapView.getZoom() - this._zoomBase + 1;
                if (zoom < 0) {
                    scaling = 1 / (Math.abs(zoom) + 1) * this._zoomScale;
                } else {
                    scaling = (1 + zoom) * this._zoomScale;
                }
            }
        } else {
            scaling = Math.pow(2, this.mapView.getZoom() - this._zoomBase);
        }
        if (this._cache.scaling !== scaling) {
            this._cache.scaling = scaling;
            this._cache.scale = Transform.scale(scaling, scaling, 1);
            cacheInvalidated = true;
        }
    } else if (this._cache.scale) {
        this._cache.scale = null;
        this._cache.scaling = null;
        cacheInvalidated = true;
    }
    var position = this._positionGetter ? this._positionGetter() : this._position;
    if (position) {
        if (this._offset) {
            position = {
                lat: MapUtility.lat(position) + MapUtility.lat(this._offset),
                lng: MapUtility.lng(position) + MapUtility.lng(this._offset)
            };
        }
        var rotateTowards = this._rotateTowardsGetter ? this._rotateTowardsGetter() : this._rotateTowards;
        if (rotateTowards) {
            var rotation = MapUtility.rotationFromPositions(position, rotateTowards);
            rotation += this.mapView.getRotation();
            if (this._cache.rotation !== rotation) {
                this._cache.rotation = rotation;
                this._cache.rotate = Transform.rotateZ(rotation);
                cacheInvalidated = true;
            }
        } else if (this._cache.rotate) {
            this._cache.rotate = null;
            this._cache.rotation = null;
            cacheInvalidated = true;
        }
        var point = this.mapView.pointFromPosition(position);
        if (!this._cache.point || point.x !== this._cache.point.x || point.y !== this._cache.point.y) {
            this._cache.point = point;
            this._cache.translate = Transform.translate(point.x, point.y, 0);
            cacheInvalidated = true;
        }
    } else if (this._cache.translate) {
        this._cache.point = null;
        this._cache.translate = null;
        cacheInvalidated = true;
    }
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./MapUtility":5}],2:[function(require,module,exports){
(function (global){
'use strict';
var Transitionable = typeof window !== 'undefined' ? window.famous.transitions.Transitionable : typeof global !== 'undefined' ? global.famous.transitions.Transitionable : null;
var MapUtility = require('./MapUtility');
function MapPositionTransitionable(position) {
    this.position = new Transitionable([
        0,
        0
    ]);
    if (position) {
        this.set(position);
    }
}
MapPositionTransitionable.prototype.setDefaultTransition = function setDefaultTransition(transition) {
    this.position.setDefault(transition);
};
MapPositionTransitionable.prototype.reset = function reset(position) {
    var latlng = [
            MapUtility.lat(position),
            MapUtility.lng(position)
        ];
    this.position.reset(latlng);
    this._final = position;
};
MapPositionTransitionable.prototype.set = function set(position, transition, callback) {
    var latlng = [
            MapUtility.lat(position),
            MapUtility.lng(position)
        ];
    this.position.set(latlng, transition, callback);
    this._final = position;
    return this;
};
MapPositionTransitionable.prototype.get = function get() {
    if (this.isActive()) {
        var latlng = this.position.get();
        return {
            lat: latlng[0],
            lng: latlng[1]
        };
    } else {
        return this._final;
    }
};
MapPositionTransitionable.prototype.getFinal = function getFinal() {
    return this._final;
};
MapPositionTransitionable.prototype.isActive = function isActive() {
    return this.position.isActive();
};
MapPositionTransitionable.prototype.halt = function halt() {
    this._final = this.get();
    this.position.halt();
};
module.exports = MapPositionTransitionable;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./MapUtility":5}],3:[function(require,module,exports){
'use strict';
var MapModifier = require('./MapModifier');
var MapPositionTransitionable = require('./MapPositionTransitionable');
function MapStateModifier(options) {
    this.mapView = options.mapView;
    this._positionState = new MapPositionTransitionable(options.position);
    this._rotateTowardsState = new MapPositionTransitionable(options.rotateTowards);
    this._modifier = new MapModifier({ mapView: this.mapView });
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
MapStateModifier.prototype.setPosition = function (position, transition, callback) {
    this._positionState.set(position, transition, callback);
    return this;
};
MapStateModifier.prototype.rotateTowards = function (position, transition, callback) {
    this._rotateTowardsState.set(position, transition, callback);
};
MapStateModifier.prototype.setZoomBase = function (zoomBase) {
    this._modifier.zoomBaseFrom(zoomBase);
    return this;
};
MapStateModifier.prototype.setZoomScale = function (zoomScale) {
    this._modifier.zoomScaleFrom(zoomScale);
    return this;
};
MapStateModifier.prototype.setOffset = function (offset) {
    this._modifier.offsetFrom(offset);
    return this;
};
MapStateModifier.prototype.getPosition = function () {
    return this._positionState.get();
};
MapStateModifier.prototype.getRotateTowards = function () {
    return this._rotateTowardsState.get();
};
MapStateModifier.prototype.getFinalPosition = function () {
    return this._positionState.getFinal();
};
MapStateModifier.prototype.getFinalRotateTowards = function () {
    return this._rotateTowardsState.getFinal();
};
MapStateModifier.prototype.getZoomBase = function () {
    return this._modifier.getZoomBase();
};
MapStateModifier.prototype.getZoomScale = function () {
    return this._modifier.getZoomScale();
};
MapStateModifier.prototype.getOffset = function () {
    return this._modifier.getOffset();
};
MapStateModifier.prototype.halt = function () {
    this._positionState.halt();
    this._rotateTowardsState.halt();
};
MapStateModifier.prototype.isActive = function () {
    return this._positionState.isActive() || this._rotateTowardsState.isActive();
};
MapStateModifier.prototype.modify = function modify(target) {
    this._modifier.positionFrom(this._positionState.get());
    this._modifier.rotateTowardsFrom(this._rotateTowardsState.getFinal());
    return this._modifier.modify(target);
};
module.exports = MapStateModifier;
},{"./MapModifier":1,"./MapPositionTransitionable":2}],4:[function(require,module,exports){
'use strict';
var MapUtility = require('./MapUtility');
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
MapTransition.DEFAULT_OPTIONS = { speed: 1000 };
function _interpolate(a, b, t) {
    return (1 - t) * a + t * b;
}
function _clone(obj) {
    return obj.slice(0);
}
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
    this._duration = this._distance / this._speed * (60 * 60 * 1000);
};
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
    } else if (timeSinceStart < 0) {
        this.state = this._startState;
    } else {
        var t = timeSinceStart / this._duration;
        var lat = _interpolate(this._startState[0], this._endState[0], t);
        var lng = _interpolate(this._startState[1], this._endState[1], t);
        this.state = [
            lat,
            lng
        ];
    }
    return this.state;
};
MapTransition.prototype.isActive = function isActive() {
    return this._active;
};
MapTransition.prototype.halt = function halt() {
    this.set(this.get());
};
module.exports = MapTransition;
},{"./MapUtility":5}],5:[function(require,module,exports){
'use strict';
var MapUtility = {};
MapUtility.lat = function lat(position) {
    if (position instanceof Array) {
        return position[0];
    } else if (position.lat instanceof Function) {
        return position.lat();
    } else {
        return position.lat;
    }
};
MapUtility.lng = function lng(position) {
    if (position instanceof Array) {
        return position[1];
    } else if (position.lng instanceof Function) {
        return position.lng();
    } else {
        return position.lng;
    }
};
MapUtility.equals = function (position1, position2) {
    return MapUtility.lat(position1) === MapUtility.lat(position2) && MapUtility.lng(position1) === MapUtility.lng(position2);
};
MapUtility.radiansFromDegrees = function (deg) {
    return deg * (Math.PI / 180);
};
MapUtility.rotationFromPositions = function (start, end) {
    return Math.atan2(MapUtility.lng(start) - MapUtility.lng(end), MapUtility.lat(start) - MapUtility.lat(end)) + Math.PI / 2;
};
MapUtility.distanceBetweenPositions = function (start, end) {
    var R = 6371;
    var lat1 = MapUtility.radiansFromDegrees(MapUtility.lat(start));
    var lat2 = MapUtility.radiansFromDegrees(MapUtility.lat(end));
    var deltaLat = MapUtility.radiansFromDegrees(MapUtility.lat(end) - MapUtility.lat(start));
    var deltaLng = MapUtility.radiansFromDegrees(MapUtility.lng(end) - MapUtility.lng(start));
    var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};
module.exports = MapUtility;
},{}],6:[function(require,module,exports){
(function (global){
'use strict';
var Surface = typeof window !== 'undefined' ? window.famous.core.Surface : typeof global !== 'undefined' ? global.famous.core.Surface : null;
var SizeAwareView = typeof window !== 'undefined' ? window.famous.views.SizeAwareView : typeof global !== 'undefined' ? global.famous.views.SizeAwareView : null;
var Transitionable = typeof window !== 'undefined' ? window.famous.transitions.Transitionable : typeof global !== 'undefined' ? global.famous.transitions.Transitionable : null;
var MapUtility = require('./MapUtility');
var MapPositionTransitionable = require('./MapPositionTransitionable');
var MapTransition = require('./MapTransition');
Transitionable.registerMethod('map-speed', MapTransition);
var globalMapViewId = 1;
var MapType = {
        GOOGLEMAPS: 1,
        LEAFLET: 2,
        OPENLAYERS3: 3,
        MAPBOXGL: 4
    };
function MapView() {
    SizeAwareView.apply(this, arguments);
    this.map = null;
    this.mapType = this.options.type;
    this._position = new MapPositionTransitionable(this.options.mapOptions.center);
    this._zoom = {
        center: new MapPositionTransitionable(this.options.mapOptions.center),
        northEast: new MapPositionTransitionable(this.options.mapOptions.center),
        southWest: new MapPositionTransitionable(this.options.mapOptions.center)
    };
    this._cache = {};
    if (this.mapType === MapType.LEAFLET) {
        this.options.zoomTransition = { duration: 0 };
    }
    if (this.options.mapOptions && this.options.id) {
        this.mapId = this.options.id;
    } else {
        this.mapId = 'MapView' + globalMapViewId;
        globalMapViewId++;
        var surface = new Surface({
                classes: [
                    'mapview',
                    'fm-mapview'
                ],
                content: '<div id="' + this.mapId + '" style="width: 100%; height: 100%;"></div>',
                size: [
                    undefined,
                    undefined
                ]
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
        center: {
            lat: 51.4400867,
            lng: 5.4782571
        }
    },
    id: null,
    zoomTransition: { duration: 100 }
};
MapView.prototype._initMap = function () {
    var elm = document.getElementById(this.mapId);
    if (!elm) {
        return;
    }
    var options;
    switch (this.mapType) {
    case MapType.GOOGLEMAPS:
        this.map = new google.maps.Map(elm, this.options.mapOptions);
        var func = this.map.addListener('projection_changed', function () {
                google.maps.event.removeListener(func);
                this._initComplete = true;
            }.bind(this));
        break;
    case MapType.LEAFLET:
        this.map = L.map(elm, this.options.mapOptions);
        this._initComplete = true;
        break;
    case MapType.OPENLAYERS3:
        options = this.options.mapOptions;
        var center = options.center;
        this.map = new ol.Map({
            target: elm,
            controls: ol.control.defaults({ attributionOptions: { collapsible: false } }),
            view: new ol.View({
                center: ol.proj.transform([
                    MapUtility.lng(center),
                    MapUtility.lat(center)
                ], 'EPSG:4326', 'EPSG:3857'),
                zoom: options.zoom
            })
        });
        this._surface.on('resize', function () {
            this.map.updateSize();
        }.bind(this));
        this._surface.on('deploy', function () {
            if (this._initComplete) {
                this.map.updateSize();
            }
        }.bind(this));
        this.map.once('postrender', function () {
            this._initComplete = true;
        }.bind(this));
        break;
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
MapView.prototype.getMap = function () {
    return this.map;
};
MapView.prototype.isInitialized = function () {
    return this._initComplete && this._loadEventEmitted;
};
MapView.prototype.setPosition = function (position, transition, callback) {
    this._position.set(position, transition, callback);
    this._positionInvalidated = true;
    return this;
};
MapView.prototype.getPosition = function () {
    return this._zoom.center.get();
};
MapView.prototype.getFinalPosition = function () {
    return this._position.getFinal();
};
MapView.prototype.getZoom = function () {
    return this._cache.zoom;
};
MapView.prototype.getRotation = function () {
    switch (this.mapType) {
    case MapType.GOOGLEMAPS:
    case MapType.LEAFLET:
        return 0;
    case MapType.OPENLAYERS3:
        return this.map.getView().getRotation();
    case MapType.MAPBOXGL:
        return this.map.getBearing() * Math.PI / -180;
    }
};
MapView.prototype.pointFromPosition = function (position) {
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
        pnt = this.map.latLngToContainerPoint(position);
        return pnt;
    case MapType.OPENLAYERS3:
        pnt = this.map.getPixelFromCoordinate(ol.proj.transform([
            MapUtility.lng(position),
            MapUtility.lat(position)
        ], 'EPSG:4326', 'EPSG:3857'));
        return {
            x: pnt[0],
            y: pnt[1]
        };
    case MapType.MAPBOXGL:
        return this.map.project([
            MapUtility.lat(position),
            MapUtility.lng(position)
        ]);
    }
};
MapView.prototype.positionFromPoint = function (point) {
    switch (this.mapType) {
    case MapType.GOOGLEMAPS:
        var worldPoint = new google.maps.Point(point.x / this._cache.scale + this._cache.bottomLeft.x, point.y / this._cache.scale + this._cache.topRight.y);
        return this.map.getProjection().fromPointToLatLng(worldPoint);
    case MapType.LEAFLET:
        return this.map.containerPointToLatLng(point);
    case MapType.OPENLAYERS3:
        var lonLat = ol.proj.transform(this.map.getCoordinateFromPixel([
                point.x,
                point.y
            ]), 'EPSG:3857', 'EPSG:4326');
        return {
            lat: lonLat[1],
            lng: lonLat[0]
        };
    case MapType.MAPBOXGL:
        return this.map.unproject(point);
    }
};
MapView.prototype.getSize = function () {
    return this._cache.size;
};
MapView.prototype.halt = function () {
    this._position.halt();
    this._positionInvalidated = true;
};
MapView.prototype.isActive = function () {
    return this._position.isActive();
};
MapView.prototype._updateCache = function (zoom, northEast, southWest) {
    this._cache.finalZoom = zoom;
    this._cache.finalScale = Math.pow(2, this._cache.finalZoom);
    this._cache.finalNorthEast = northEast;
    this._cache.finalSouthWest = southWest;
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
        this._cache.size = [
            point.x,
            point.y
        ];
        break;
    case MapType.OPENLAYERS3:
        this._cache.size = this.map.getSize();
        break;
    case MapType.MAPBOXGL:
        this._cache.size = this.getParentSize();
        break;
    }
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
        this._cache.zoom = zoom;
        break;
    }
};
MapView.prototype._getMapInfo = function () {
    var bounds;
    var northEast;
    var southWest;
    var center;
    var zoom;
    switch (this.mapType) {
    case MapType.GOOGLEMAPS:
        bounds = this.map.getBounds();
        center = this.map.getCenter();
        zoom = this.map.getZoom();
        var centerLng = MapUtility.lng(center);
        northEast = bounds.getNorthEast();
        var northEastLng = northEast.lng();
        while (northEastLng < centerLng) {
            northEastLng += 360;
        }
        while (northEastLng > centerLng + 360) {
            northEastLng -= 360;
        }
        southWest = bounds.getSouthWest();
        var southWestLng = southWest.lng();
        while (southWestLng < centerLng - 360) {
            southWestLng += 360;
        }
        while (southWestLng > centerLng) {
            southWestLng -= 360;
        }
        return {
            zoom: zoom,
            center: {
                lat: center.lat(),
                lng: center.lng()
            },
            southWest: {
                lat: southWest.lat(),
                lng: southWestLng
            },
            northEast: {
                lat: northEast.lat(),
                lng: northEastLng
            }
        };
    case MapType.LEAFLET:
        bounds = this.map.getBounds();
        southWest = bounds.getSouthWest();
        northEast = bounds.getNorthEast();
        center = this.map.getCenter();
        zoom = this.map.getZoom();
        return {
            zoom: zoom,
            center: {
                lat: center.lat,
                lng: center.lng
            },
            southWest: {
                lat: southWest.lat,
                lng: southWest.lng
            },
            northEast: {
                lat: northEast.lat,
                lng: northEast.lng
            }
        };
    case MapType.OPENLAYERS3:
        var view = this.map.getView();
        bounds = ol.proj.transformExtent(view.calculateExtent(this.map.getSize()), 'EPSG:3857', 'EPSG:4326');
        center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
        zoom = view.getZoom();
        return {
            zoom: zoom,
            center: {
                lat: center[1],
                lng: center[0]
            },
            southWest: {
                lat: bounds[1],
                lng: bounds[0]
            },
            northEast: {
                lat: bounds[3],
                lng: bounds[2]
            },
            rotation: view.getRotation()
        };
    case MapType.MAPBOXGL:
        bounds = this.map.getBounds();
        return {
            zoom: this.map.getZoom(),
            center: this.map.getCenter(),
            southWest: bounds.getSouthWest(),
            northEast: bounds.getNorthEast(),
            rotation: this.map.getBearing() * Math.PI / -180
        };
    }
};
MapView.prototype.render = function render() {
    if (!this.map) {
        this._initMap();
    }
    if (this._initComplete) {
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
        } else {
            this._zoom.northEast.get();
            invalidateCache = true;
        }
        if (invalidateCache || info.zoom !== this._cache.finalZoom || !MapUtility.equals(info.northEast, this._cache.finalNorthEast) || !MapUtility.equals(info.southWest, this._cache.finalSouthWest)) {
            this._updateCache(info.zoom, info.northEast, info.southWest);
        }
        if (this._position.isActive() || this._positionInvalidated) {
            options = { center: this._position.get() };
            this._positionInvalidated = false;
        } else {
            this._position.reset(info.center);
        }
        if (options) {
            switch (this.mapType) {
            case MapType.GOOGLEMAPS:
                this.map.setOptions(options);
                break;
            case MapType.LEAFLET:
                this.map.panTo(options.center, { animate: false });
                break;
            case MapType.OPENLAYERS3:
                this.map.getView().setCenter(ol.proj.transform([
                    MapUtility.lng(options.center),
                    MapUtility.lat(options.center)
                ], 'EPSG:4326', 'EPSG:3857'));
                break;
            case MapType.MAPBOXGL:
                this.map.setCenter([
                    MapUtility.lat(options.center),
                    MapUtility.lng(options.center)
                ]);
                break;
            }
        }
        if (!this._loadEventEmitted) {
            this._loadEventEmitted = true;
            this._eventOutput.emit('load', this);
        }
    }
    return this._node.render();
};
function _elementIsChildOfMapView(element) {
    if (element.className.indexOf('fm-mapview') >= 0) {
        return true;
    }
    return element.parentElement ? _elementIsChildOfMapView(element.parentElement) : false;
}
MapView.installSelectiveTouchMoveHandler = function () {
    window.addEventListener('touchmove', function (event) {
        if (!_elementIsChildOfMapView(event.target)) {
            event.preventDefault();
        }
    });
};
module.exports = MapView;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./MapPositionTransitionable":2,"./MapTransition":4,"./MapUtility":5}],7:[function(require,module,exports){
if (typeof famousmap === 'undefined') {
    famousmap = {};
}

famousmap.MapView = require('./MapView');
famousmap.MapModifier = require('./MapModifier');
famousmap.MapStateModifier = require('./MapStateModifier');
famousmap.MapTransition = require('./MapTransition');
famousmap.MapPositionTransitionable = require('./MapPositionTransitionable');
famousmap.MapUtility = require('./MapUtility');

},{"./MapModifier":1,"./MapPositionTransitionable":2,"./MapStateModifier":3,"./MapTransition":4,"./MapUtility":5,"./MapView":6}]},{},[7]);
