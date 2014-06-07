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
    var MapItemModifier = require('./MapItemModifier');
    var MapPositionTransitionable = require('./MapPositionTransitionable');

    /**
     * @class MapItemStateModifier
     * @constructor
     * @param {Object} options Options.
     */
    function MapItemStateModifier(options) {
        this.mapView = options.mapView;
        this._positionState = new MapPositionTransitionable(options.position);
        this._rotateTowardsState = new MapPositionTransitionable(options.rotateTowards);
        
        this._modifier = new MapItemModifier({
            mapView: this.mapView
        });
        
        if (options.position) { this.setPosition(options.position); }
        if (options.rotateTowards) { this.rotateTowards(options.rotateTowards); }
    }

    /**
     * Set the geographical position, by adding the new position to the queue of transitions.
     *
     * @method setPosition
     * @param {LatLng} position New position in geographical coordinates (Latitude, Longitude).
     * @param {Transition} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapItemStateModifier.prototype.setPosition = function (position, transition, callback) {
        this._positionState.set(position, transition, callback);
        return this;
    };
    
    /* Adds a content-rotation transition to the queue of pending transitions.
     * The angle of the rotation is determined on the current location and
     * the specified location.
     *
     * @method rotateTowards
     * @param {LatLng} position Position in geographical coordinates (Latitude, Longitude).
     * @param {Transition} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapItemStateModifier.prototype.rotateTowards = function (position, transition, callback) {
        this._rotateTowardsState.set(position, transition, callback);
    };
    
    /**
     * Set the base zoom-scale. When set the scale is increased when zooming in and 
     * decreased when zooming-out.
     *
     * @method setZoomScale
     * @param {Number} zoomScale Factor by which the scale is adjusted according to the map zoom-level.
     */
    MapItemStateModifier.prototype.setZoomScale = function (zoomScale) {
        this._modifier.setZoomScale(zoomScale);
        return this;
    };
    
    /**
     * Set the base zoom-level. This options is ignored unless the zoomScale is set.
     * See zoomScale.
     *
     * @method zoomBaseFrom
     * @param {Number} zoomBase Map zoom-level
     */
    MapItemStateModifier.prototype.setZoomBase = function (zoomBase) {
        this._modifier.setZoomBase(zoomBase);
        return this;
    };
    
    /**
     * Set the displacement offset in geographical coordinates.
     *
     * @method offsetFrom
     * @chainable
     * @param {LatLng} displacement offset in geographical coordinates.
     */
    MapItemStateModifier.prototype.setOffset = function (offset) {
        this._modifier.setOffset(offset);
        return this;
    };
        
    /**
     * Get the current geographical position.
     *
     * @method getPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapItemStateModifier.prototype.getPosition = function () {
        return this._positionState.get();
    };
    
    /**
     * Get the geographical position to which the rotation is set towards.
     *
     * @method getRotateTowards
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapItemStateModifier.prototype.getRotateTowards = function () {
        return this._rotateTowardsState.get();
    };
     
    /**
     * Get the destination geographical position.
     *
     * @method getFinalPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapItemStateModifier.prototype.getFinalPosition = function () {
        return this._positionState.getFinal();
    };
    
    /**
     * Get the destination geographical position to which the rotation is set towards.
     *
     * @method getFinalRotateTowards
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapItemStateModifier.prototype.getFinalRotateTowards = function () {
        return this._rotateTowardsState.getFinal();
    };
    
    /**
     * TODO
     *
     * @method getZoomScale
     * @return {Number} 
     */
    MapItemStateModifier.prototype.getZoomScale = function () {
        return this._modifier.getZoomScale();
    };
    
    /**
     * TODO
     *
     * @method getZoomBase
     * @return {Number} 
     */
    MapItemStateModifier.prototype.getZoomBase = function () {
        return this._modifier.getZoomBase();
    };
    
    /**
     * Get the geographical displacement offset.
     *
     * @method getOffset
     * @return {LatLng} Offset in geographical coordinates (Latitude, Longitude)
     */
    MapItemStateModifier.prototype.getOffset = function () {
        return this._modifier.getOffset();
    };
    
    /**
     * Halts any pending transitions.
     *
     * @method halt
     */
    MapItemStateModifier.prototype.halt = function () {
        this._positionState.halt();
        this._rotateTowardsState.halt();
    };

    /**
     * Is there at least one transition pending completion?
     *
     * @method isActive
     * @return {Bool} True when there are active transitions running.
     */
    MapItemStateModifier.prototype.isActive = function () {
        return this._positionState.isActive() || this._rotateTowardsState.isActive();
    };

    /**
     * Return render spec for this StateModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this StateModifier, including the
     *    provided target
     */
    MapItemStateModifier.prototype.modify = function modify(target) {
        this._modifier.positionFrom(this._positionState.get());
        this._modifier.rotateTowardsFrom(this._rotateTowardsState.get());
        return this._modifier.modify(target);
    };
    
    module.exports = MapItemStateModifier;
});
