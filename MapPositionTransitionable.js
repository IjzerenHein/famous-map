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
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * @class MapPositionTransitionable
     * @constructor
     * @param {LatLng} [position] Position;
     */
    function MapPositionTransitionable(position) {
        this.position = new Transitionable([0, 0]);
        if (position) { this.set(position); }
    }

    /**
     * Sets the default transition to use for transitioning between position states.
     *
     * @method setDefaultTransition
     * @param  {Object} transition Transition definition
     */
    MapPositionTransitionable.prototype.setDefaultTransition = function setDefaultTransition(transition) {
        this.position.setDefault(transition);
    };
    
    /**
     * Set the geographical position by adding it to the queue of transition.
     *
     * @method set
     * @chainable
     *
     * @param {LatLng} position
     * @param {Object} [transition[ Transition definition
     * @param {Function} [callback] Callback
     * @return {MapPositionTransitionable}
     */
    MapPositionTransitionable.prototype.set = function set(position, transition, callback) {
        var latlng = [position.lat(), position.lng()];
        this.position.set(latlng, transition, callback);
        this._final = position;
        return this;
    };
    
    /**
     * Get the current geographical position.
     *
     * @method get
     * @return {LatLng}
     */
    MapPositionTransitionable.prototype.get = function get() {
        if (this.isActive()) {
            var latlng = this.position.get();
            return new google.maps.LatLng(
                latlng[0],
                latlng[1]
            );
        } else {
            return this._final;
        }
    };

    /**
     * Get the destination geographical position.
     *
     * @method getFinal
     * @return {LatLng}
     */
    MapPositionTransitionable.prototype.getFinal = function getFinal() {
        return this._final;
    };

    /**
     * Determine if the MapPositionTransitionable is currently transitioning
     *
     * @method isActive
     * @return {Boolean}
     */
    MapPositionTransitionable.prototype.isActive = function isActive() {
        return this.position.isActive();
    };

    /**
     * Halts the transition
     *
     * @method halt
     */
    MapPositionTransitionable.prototype.halt = function halt() {
        this._final = this.get();
        this.position.halt();
    };

    module.exports = MapPositionTransitionable;
});
