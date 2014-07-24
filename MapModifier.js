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

/*global define*/

/**
 * The MapModifier makes it possible to link renderables to a geopgraphical position on a `MapView`.
 * Additionally it adds functionality for rotating and zooming renderables, and possibly all kinds of future  map-related transformations.
 * Use `MapStateModifier` if you want to use transitions, e.g. to animate a move from one geographical position to another.
 *
 * @module
 */
define(function(require, exports, module) {
    'use strict';

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
        } else if (position instanceof Function) {
            this._positionGetter = position;
        } else if (position instanceof Object && position.getPosition) {
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
        } else if (position instanceof Function) {
            this._rotateTowardsGetter = position;
        } else if (position instanceof Object && position.getPosition) {
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
        } else if (this._cache.scale) {
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

            // Calculate translation transform
            var point = this.mapView.pointFromPosition(position);
            if (!this._cache.point || (point.x !== this._cache.point.x) || (point.y !== this._cache.point.y)) {
                this._cache.point = point;
                this._cache.translate = Transform.translate(point.x, point.y, 0);
                cacheInvalidated = true;
            }
        } else if (this._cache.translate) {
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
