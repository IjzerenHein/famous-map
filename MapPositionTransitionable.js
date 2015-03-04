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
