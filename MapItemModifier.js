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
define(function (require, exports, module) {
    'use strict';

    // import dependencies
    var Transform = require('famous/core/Transform');

    /**
     * @class MapItemModifier
     * @constructor
     * @param {MapView} mapView Map-view to which the item is pinned. The map-view is used to convert LatLng into pixel coordinates. 
     * @param {Object} options Options.
     */
    function MapItemModifier(options) {
        
        this.mapView = options.mapView;
                
        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            target: null
        };
        
        this._position = options.position;
        this._offset = options.offset;
        this._zoomScale = options.zoomScale;
        this._zoomBase = options.zoomBase;
        this._rotateTowardsGetter = null;
        
        if (options.rotateTowards) { this.rotateTowardsFrom(options.rotateTowards); }
    }

    /**
     * Set the geographical position on the map.
     *
     * @method positionFrom
     * @param {LatLng} position New position in geographical coordinates (Latitude, Longitude).
     */
    MapItemModifier.prototype.positionFrom = function (position) {
        this._position = position;
        return this;
    };
    
    /**
     * Set the geographical position to which to rotate towards.
     *
     * @method rotateTowardsFrom
     * @chainable
     * @param {LatLng} rotateTowards Position to which to point to.
     */
    MapItemModifier.prototype.rotateTowardsFrom = function (rotateTowards) {
        if (!rotateTowards) {
            this._rotateTowardsGetter = null;
            this._rotateTowards = null;
        } else if (rotateTowards instanceof Function) {
            this._rotateTowardsGetter = rotateTowards;
        } else if (rotateTowards instanceof Object && rotateTowards.getPosition) {
            this._rotateTowardsGetter = rotateTowards.getPosition.bind(rotateTowards);
        } else {
            this._rotateTowardsGetter = null;
            this._rotateTowards = rotateTowards;
        }
        return this;
    };
    
    /**
     * Set the base zoom-scale. When set the scale is increased when zooming in and 
     * decreased when zooming-out.
     *
     * @method zoomScaleFrom
     * @param {Number} zoomScale Factor by which the scale is adjusted according to the map zoom-level.
     */
    MapItemModifier.prototype.zoomScaleFrom = function (zoomScale) {
        this._zoomScale = zoomScale;
        return this;
    };
    
    /**
     * Set the base zoom-level. This options is ignored unless the zoomScale is set.
     * See zoomScale.
     *
     * @method zoomBaseFrom
     * @param {Number} zoomBase Map zoom-level
     */
    MapItemModifier.prototype.zoomBaseFrom = function (zoomBase) {
        this._zoomBase = zoomBase;
        return this;
    };
    
    /**
     * Set the displacement offset in geographical coordinates.
     *
     * @method offsetFrom
     * @chainable
     * @param {LatLng} displacement offset in geographical coordinates.
     */
    MapItemModifier.prototype.offsetFrom = function (offset) {
        this._offset = offset;
        return this;
    };
    
    /**
     * Get the current geographical position.
     *
     * @method getPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapItemModifier.prototype.getPosition = function () {
        return this._position;
    };
    
    /**
     * Get the geographical position to which to rotate to.
     *
     * @method getRotateTowards
     * @return {LatLng} rotateTowards Position to which to point to.
     */
    MapItemModifier.prototype.getRotateTowards = function () {
        return this._rotateTowardsGetter || this._rotateTowards;
    };
    
    /**
     * TODO
     *
     * @method getZoomScale
     * @return {Number} 
     */
    MapItemModifier.prototype.getZoomScale = function () {
        return this._zoomScale;
    };
    
    /**
     * TODO
     *
     * @method getZoomBase
     * @return {Number} 
     */
    MapItemModifier.prototype.getZoomBase = function () {
        return this._zoomBase;
    };
    
    /**
     * Get the geographical displacement offset.
     *
     * @method getOffset
     * @return {LatLng} Offset in geographical coordinates (Latitude, Longitude)
     */
    MapItemModifier.prototype.getOffset = function () {
        return this._offset;
    };
    
    /**
     * Return render spec for this MapItemModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this MapItemModifier, including the
     *    provided target
     */
    MapItemModifier.prototype.modify = function modify(target) {
        var transform;
        
        // Move, rotate, etc... based on position
        if (this._position) {

            // Calculate scale transform
            if (this._zoomBase) {
                var scaling;
                if (this._zoomScale) {
                    if (this._zoomScale instanceof Function) {
                        scaling = this._zoomScale(this._zoomBase, this.mapView.getZoom());
                    } else {
                        var zoom = this.mapView.getZoom() - this._zoomBase;
                        if (zoom < 0) {
                            scaling = 1 / (this._zoomScale * (Math.abs(zoom) + 1));
                        } else {
                            scaling = 1 + (this._zoomScale * zoom);
                        }
                    }
                } else {
                    scaling = Math.pow(2, this.mapView.getZoom() - this._zoomBase);
                }
                var scale = Transform.scale(scaling, scaling, 1.0);
                transform = transform ? Transform.multiply(scale, transform) : scale;
            }
            
            // Calculate rotation transform
            var rotateTowards = this._rotateTowardsGetter ? this._rotateTowardsGetter() : this._rotateTowards;
            if (rotateTowards) {
                var rotation = this.mapView.rotationFromPositions(this._position, rotateTowards);
                var rotate = Transform.rotateZ(rotation);
                transform = transform ? Transform.multiply(rotate, transform) : rotate;
            }
            
            // Offset position
            var position = this._position;
            if (this.offset) {
                position = new google.maps.LatLng(
                    position.lat() + this.offset.lat(),
                    position.lng() + this.offset.lng()
                );
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
    
    module.exports = MapItemModifier;
});
