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
 * @title MapModifier
 * 
 * The MapModifier makes it possible to link renderables to a geopgraphical position on a `MapView`.
 * Additionally it adds functionality for rotating and zooming renderables, and possibly all kinds of future 
 * map-related transformations.
 *
 * Use `MapStateModifier` if you want to use transitions, e.g. to animate a move from one geographical position
 * to another.
 *
 * ### Options
 *
 * **mapView**: {MapView} The MapView.
 *
 * **[position]**: {LatLng} Initial geographical coordinates.
 *
 * **[offset]**: {LatLng} Displacement offset in geographical coordinates from the position.
 *
 * **[rotateTowards]**: {LatLng, Object, Function} Position to rotate the renderables towards.
 *
 * **[zoomBase]**: {Number} Base zoom-level at which the renderables are displayed in their true size.
 *
 * **[zoomScale]**: {Number, Function} Customer zoom-scaling factor or function.
 */
define(function (require, exports, module) {
    'use strict';

    // import dependencies
    var Transform = require('famous/core/Transform');

    /**
     * @class MapModifier
     *
     * @method constructor
     * @constructor
     * @param {Object} options Options.
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
        
        this._positionGetter = null;
        this._rotateTowardsGetter = null;
        this._offset = options.offset;
        this._zoomScale = options.zoomScale;
        this._zoomBase = options.zoomBase;
                
        if (options.position) { this.positionFrom(options.position); }
        if (options.rotateTowards) { this.rotateTowardsFrom(options.rotateTowards); }
    }
    
    /**
     * Set the geographical position of the renderables.
     *
     * @method positionFrom
     * @param {LatLng, Function, Object} position Position in geographical coordinates.
     */
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
    
    /**
     * Set the geographical position to rotate the renderables towards.
     * The child renderables are assumed to be rotated to the right by default.
     * To change the base rotation, add a rotation-transform to the renderable, like this: 
     * `new Modifier({transform: Transform.rotateZ(Math.PI/2)})`
     *
     * @method rotateTowardsFrom
     * @param {LatLng} position Geographical position to rotate towards.
     */
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
    
    /**
     * Set the base zoom-level. When set, auto-zooming is effectively enabled.
     * The renderables are then displayed in their true size when the map zoom-level equals zoomBase.
     *
     * @method zoomBaseFrom
     * @param {Number} zoomBase Map zoom-level
     */
    MapModifier.prototype.zoomBaseFrom = function (zoomBase) {
        this._zoomBase = zoomBase;
        return this;
    };

    /**
     * Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and 
     * decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
     * a scale-factor, with the following signature: function (zoomBase, zoomCurrent).
     *
     * @method zoomScaleFrom
     * @param {Number,Function} zoomScale Zoom-scale factor or function.
     */
    MapModifier.prototype.zoomScaleFrom = function (zoomScale) {
        this._zoomScale = zoomScale;
        return this;
    };
        
    /**
     * Set the displacement offset in geographical coordinates.
     *
     * @method offsetFrom
     * @param {LatLng} offset Displacement offset in geographical coordinates.
     */
    MapModifier.prototype.offsetFrom = function (offset) {
        this._offset = offset;
        return this;
    };
    
    /**
     * Get the current geographical position.
     *
     * @method getPosition
     * @return {LatLng} Position in geographical coordinates.
     */
    MapModifier.prototype.getPosition = function () {
        return this._positionGetter || this._position;
    };
    
    /**
     * Get the geographical position towards which the renderables are rotated.
     *
     * @method getRotateTowards
     * @return {LatLng} Geographical position towards which renderables are rotated.
     */
    MapModifier.prototype.getRotateTowards = function () {
        return this._rotateTowardsGetter || this._rotateTowards;
    };
    
    /**
     * Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
     * displayed in their true size.
     *
     * @method getZoomBase
     * @return {Number} Base zoom level
     */
    MapModifier.prototype.getZoomBase = function () {
        return this._zoomBase;
    };
    
    /**
     * Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
     * a scale-factor.
     *
     * @method getZoomScale
     * @return {Number, Function} Zoom-scale
     */
    MapModifier.prototype.getZoomScale = function () {
        return this._zoomScale;
    };
    
    /**
     * Get the geographical displacement offset.
     *
     * @method getOffset
     * @return {LatLng} Offset in geographical coordinates.
     */
    MapModifier.prototype.getOffset = function () {
        return this._offset;
    };
    
    /**
     * Return render spec for this MapModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @method modify
     * @private
     * @ignore
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this MapModifier, including the
     *    provided target
     */
    MapModifier.prototype.modify = function modify(target) {
        var transform;
        
        // Calculate scale transform
        if (this._zoomBase) {
            var scaling;
            if (this._zoomScale) {
                if (this._zoomScale instanceof Function) {
                    scaling = this._zoomScale(this._zoomBase, this.mapView.getZoom());
                } else {
                    var zoom = this.mapView.getZoom() - this._zoomBase;
                    if (zoom < 0) {
                        scaling = (1 / (Math.abs(zoom) + 1)) * this._zoomScale;
                    } else {
                        scaling = (1 + zoom) * this._zoomScale;
                    }
                }
            } else {
                scaling = Math.pow(2, this.mapView.getZoom() - this._zoomBase);
            }
            var scale = Transform.scale(scaling, scaling, 1.0);
            transform = transform ? Transform.multiply(scale, transform) : scale;
        }

        // Move, rotate, etc... based on position
        var position = this._positionGetter ? this._positionGetter() : this._position;
        if (position) {
            
            // Offset position
            if (this._offset) {
                position = new google.maps.LatLng(
                    position.lat() + this._offset.lat(),
                    position.lng() + this._offset.lng()
                );
            }
            
            // Calculate rotation transform
            var rotateTowards = this._rotateTowardsGetter ? this._rotateTowardsGetter() : this._rotateTowards;
            if (rotateTowards) {
                var rotation = this.mapView.rotationFromPositions(position, rotateTowards);
                var rotate = Transform.rotateZ(rotation);
                transform = transform ? Transform.multiply(rotate, transform) : rotate;
            }

            // Calculate translation transform
            var point = this.mapView.pointFromPosition(position);
            var translate = Transform.translate(point.x, point.y, 0);
            transform = transform ? Transform.multiply(translate, transform) : translate;
        }
        
        // Update transformation matrix
        if (transform) {
            this._output.transform = transform;
        }
        
        this._output.target = target;
        return this._output;
    };
    
    module.exports = MapModifier;
});
