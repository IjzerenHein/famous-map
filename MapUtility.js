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
/*global define*/

/**
 * @title MapUtility
 */
define(function (require, exports, module) {
    'use strict';
    
    /**
     * This namespace holds standalone functionality.
     *
     * @class MapUtility
     */
    var MapUtility = {};

    
    /**
     * Converts degrees into radians (radians = degrees * (Math.PI / 180)).
     *
     * @method radiansFromDegrees
     * @param {Number} degr Degrees
     * @return {Number} radians.
     */
    MapUtility.radiansFromDegrees = function (deg) {
        return deg * (Math.PI / 180);
    };
    
    /**
     * Calculates the rotation-angle between two given positions.
     *
     * @method rotationFromPositions
     * @param {LatLng} start Start position.
     * @param {LatLng} end End position.
     * @return {Number} Rotation in radians.
     */
    MapUtility.rotationFromPositions = function (start, end) {
        return Math.atan2(start.lng() - end.lng(), start.lat() - end.lat()) + (Math.PI / 2.0);
    };
    
    /**
     * Calculates the distance between two positions in kilometers.
     *
     * @method distanceBetweenPositions
     * @param {LatLng} start Starting position
     * @param {LatLng} end End position
     * @return {Number} Distance in km
     */
    MapUtility.distanceBetweenPositions = function (start, end) {

        // Taken from: http://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371; // earths radius in km
        var lat1 = MapUtility.radiansFromDegrees(start.lat());
        var lat2 = MapUtility.radiansFromDegrees(end.lat());
        var deltaLat = MapUtility.radiansFromDegrees(end.lat() - start.lat());
        var deltaLng = MapUtility.radiansFromDegrees(end.lng() - start.lng());

        var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;
        return d;
    };
    

    module.exports = MapUtility;
});
