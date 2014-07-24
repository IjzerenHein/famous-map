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
 * The MapPositionTransitionable makes it possible to transition between two geographical
 * positions. Currently, only standard transition definitions are supported (see `Transitionable`), but in the future more interesting
 * transitions may be added.
 *
 * *This class is used internally by `MapView` and `MapStateModifier`.*
 *
 * @module
 */
define(function(require, exports, module) {
    'use strict';

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
