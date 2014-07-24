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
 * MapTransitions can transition between geographical positions using specific speed (e.g. 50 km/h).
 *
 * @module
 */
define(function(require, exports, module) {
    'use strict';

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
        speed : 1000 // mph
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
        } else if (timeSinceStart < 0) {
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
