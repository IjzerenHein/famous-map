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
    var Modifier = require('famous/core/Modifier');
    var RenderNode = require('famous/core/RenderNode');
    var View = require('famous/core/View');
    var Timer = require('famous/utilities/Timer');
    var Transform = require('famous/core/Transform');
    var RenderController = require('famous/views/RenderController');
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');

    /**
     * @class MapItem
     * @constructor
     * @param {Object} [options] Configuration options
     * @param {MapView} mapView Map-view to which the item is pinned. The map-view is used to convert LatLng into pixel coordinates. 
     */
    function MapItem(options, mapView) {
        View.apply(this, arguments);
        
        // Initialize
        this.mapView = mapView;
        this._isVisible = false;
        this._finalPosition = this.options.position;
        this._finalRotation = this.options.rotation;
        this._currentLng = new Transitionable(this._finalPosition ? this._finalPosition.lng() : 0);
        this._currentLat = new Transitionable(this._finalPosition ? this._finalPosition.lat() : 0);
        this._currentRotation = new Transitionable(this._finalRotation ? this._finalRotation.get() : 0);
        this._currentScale = new Transitionable();
            
        // Create root-modifier
        this.modifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        
        // Create render-controller
        this.renderController = new RenderController();
        this.add(this.modifier).add(this.renderController);
        
        // On every render-cycle update the position relative to the map
        Timer.every(this._update.bind(this), 0);
    }
    MapItem.prototype = Object.create(View.prototype);
    MapItem.prototype.constructor = MapItem;

    MapItem.DEFAULT_OPTIONS = {
        zoomScaleFactor: 0.0, // factor by which the image is scaled when zooming in (zoom-level 0  is the base)
        zoomInTransition: { duration: 500, curve: Easing.outBack },
        zoomOutTransition: { duration: 500, curve: Easing.outBack },
        moveTransition: { duration: 500, curve: Easing.outBack },
        rotateTransition: { duration: 500, curve: Easing.inBack }
    };

    /**
     * @private
     * @method _update
     */
    MapItem.prototype._update = function () {
        if (!this._isVisible) { return; }
        if (!this._finalPosition) { return; }

        // Calculate scale and start/stop scaling
        if (this.options.zoomScaleFactor && this.mapView.getMap()) {
            
            // When the map is zoomed in/out, restart the scale transition
            var scaleFactor = (this.mapView.getMap().getZoom() *  this.options.zoomScaleFactor) + 1.0;
            if (this._finalScale) {
                if (this._finalScale !== scaleFactor) {
                    this._finalScale = scaleFactor;
                    this._currentScale.halt();
                    if (this._currentScale.get() < scaleFactor) {
                        this._currentScale.set(scaleFactor, this.options.zoomInTransition);
                    } else {
                        this._currentScale.set(scaleFactor, this.options.zoomOutTransition);
                    }
                }
            } else {
                this._finalScale = scaleFactor;
                this._currentScale.reset(this._finalScale);
            }
        }
        
        // Check whether any transitions are active or the map has moved
        var transform;
        var point = this.mapView.pointFromPosition(this.getPosition());
        if (!this.isActive() && this._currentPoint && this._currentPoint.equals(point)) {
            // No changes detected
            return;
        }
        
        // Calculate scale
        if (this._finalScale) {
            var scale = Transform.scale(this._currentScale.get(), this._currentScale.get(), 1.0);
            transform = transform ? Transform.multiply(scale, transform) : scale;
        }
        
        // Calculate rotation
        if (this._finalRotation) {
            var rotation = this._currentRotation.get();
            var rotate = Transform.rotateZ(rotation);
            transform = transform ? Transform.multiply(rotate, transform) : rotate;
        }

        // Calculate position
        this._currentPoint = point;
        var translate = Transform.translate(point.x, point.y, 1.0);
        transform = transform ? Transform.multiply(translate, transform) : translate;
        
        // Apply transformation
        if (transform) {
            this.modifier.transformFrom(transform);
        }
    };

    /**
     * Adds a position transition to the queue of pending transitions.
     *
     * @method setPosition
     * @param {LatLng} position New position in geographical coordinates (Latitude, Longitude).
     * @param {Transition} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapItem.prototype.setPosition = function (position, transition, callback) {
        
        // The very first time, just set the position, no transitions (because there is no start-point)
        if (!this._finalPosition) {
            this._finalPosition = position;
            this._currentLng.reset(position.lng());
            this._currentLat.reset(position.lat());
            this._currentRotation.reset(this._finalRotation || 0);
            return;
        }
            
        // Set new position
        this._finalPosition = position;
        transition = transition || this.options.moveTransition;
        this._currentLng.set(position.lng(), transition, callback);
        this._currentLat.set(position.lat(), transition);
        this._currentRotation.set(this._finalRotation || 0, transition);
    };
        
    /**
     * Adds a content-rotation transition to the queue of pending transitions.
     * The angle of the rotation is determined on the current location and
     * the specified location.
     *
     * @method rotateTowards
     * @param {LatLng} position Position in geographical coordinates (Latitude, Longitude).
     * @param {Transition} [transition] Famo.us transitionable object.
     * @param {Function} [callback] callback to call after transition completes.
     */
    MapItem.prototype.rotateTowards = function (position, transition, callback) {
        
        // setPosition must be called first (2 points are required to calculate the rotation)
        if (!this._finalPosition) { return; }
        if (!this._finalRotation) { this._finalRotation = 0; }
        
        // Calculate new angle in radians
        var x = this._finalPosition.lng() - position.lng();
        var y = this._finalPosition.lat() - position.lat();
        var angle = Math.atan2(x, y) + (Math.PI / 2.0);

        // Adjust the current-rotation transitionable, so that the
        // rotation occurs in the most optimal direction.
        if (Math.abs(this._finalRotation - angle) > Math.PI) {
            if (this._finalRotation > angle) {
                angle += (2 * Math.PI);
            } else {
                angle -= (2 * Math.PI);
            }
        }

        // If possible, reduce the transition duration. A 180deg turn is
        // considered 100% duration, but a smaller takes less time.
        transition = transition || this.options.rotateTransition;
        if (transition.duration) {
            var distance = Math.abs(this._finalRotation - angle);
            var factor = 4.0; // minimal duration is 1/4 = 25%, 75% is dependent on distance
            transition = {
                curve: transition.curve,
                duration: (transition.duration / factor) + ((distance * transition.duration) / (Math.PI * factor))
            };
        }
        
        // Add rotation to the pending set of transitions
        this._finalRotation = angle;
        this._currentRotation.set(angle, transition, callback);
        this._currentLng.set(this._finalPosition.lng(), transition);
        this._currentLat.set(this._finalPosition.lat(), transition);
    };

    
    /**
     * Get the current position.
     *
     * @method getPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapItem.prototype.getPosition = function () {
        return new google.maps.LatLng(
            this._currentLat.get(),
            this._currentLng.get()
        );
    };
     
    /**
     * Get the destination position.
     *
     * @method getFinalPosition
     * @return {LatLng} Position in geographical coordinates (Latitude, Longitude)
     */
    MapItem.prototype.getFinalPosition = function () {
        return this._finalPosition;
    };
    
    /**
     * Halts any pending transitions.
     *
     * @method halt
     */
    MapItem.prototype.halt = function () {
        this._currentLng.halt();
        this._currentLat.halt();
        this._currentRotation.halt();
        this._currentScale.halt();
        
        this._finalPosition = this.getPosition();
        this._finalRotation = this._currentRotation.get();
        this._finalScale = (this.mapView.getMap().getZoom() *  this.options.zoomScaleFactor) + 1.0;
        
        this._update();
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     * @return {Bool} True when there are active transitions running.
     */
    MapItem.prototype.isActive = function () {
        return this._currentLat.isActive() ||
                this._currentLng.isActive() ||
                this._currentRotation.isActive() ||
                this._currentScale.isActive();
    };

    /**
     * Displays the targeted renderable with a transition and an optional callback toexecute afterwards.
     *
     * @method show
     * @param {Object} renderable The renderable you want to show.
     * @param {Transition} [transition] Overwrites the default transition in to display the passed-in renderable.
     * @param {Function} [callback] Executes after transitioning in the renderable.
     * @param {Number} [baseRotation] Base-rotation in radians to apply to the renderable.
     */
    MapItem.prototype.show = function (renderable, transition, callback, baseRotation) {
        this._isVisible = true;
        transition = transition || this.options.inTransition;
        
        // When a base-rotation is specified, apply that statically in the form
        // of a modifier.
        if (baseRotation) {
            var rotationNode = new RenderNode(new Modifier({
                transform: Transform.rotateZ(baseRotation)
            }));
            rotationNode.add(renderable);
            renderable = rotationNode;
        }
        
        // Show the renderable
        this.renderController.show(renderable, transition, callback);
    };

    /**
     * Hide hides the currently displayed renderable with an out transition.
     *
     * @method hide
     * @param {Transition} [transition] Overwrites the default transition in to hide the currently controlled renderable.
     * @param {Function} [callback] Executes after transitioning in the renderable.
     */
    MapItem.prototype.hide = function (transition, callback) {
        if (!this._isVisible) { return; }
        transition = transition || this.options.outTransition;
        this.renderController.hide(transition, callback);
        this._isVisible = false;
    };

    module.exports = MapItem;
});
