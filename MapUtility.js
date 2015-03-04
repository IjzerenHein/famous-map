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
 * This namespace holds standalone functionality.
 *
 * @module
 */
define(function(require, exports, module) {
    'use strict';

    /**
     * @class
     * @alias module:MapUtility
     */
    var MapUtility = {};

    /**
     * Get the latitude from the position (LatLng) object.
     *
     * @param {LatLng} position Position
     * @return {Number} Latitude in degrees
     */
    MapUtility.lat = function lat(position) {
        if (position instanceof Array) {
            return position[0];
        }
        else if (position.lat instanceof Function) {
            return position.lat();
        }
        else {
            return position.lat;
        }
    };

    /**
     * Get the longitude from the position (LatLng) object.
     *
     * @param {LatLng} position Position
     * @return {Number} Longitude in degrees
     */
    MapUtility.lng = function lng(position) {
        if (position instanceof Array) {
            return position[1];
        }
        else if (position.lng instanceof Function) {
            return position.lng();
        }
        else {
            return position.lng;
        }
    };

    /**
     * Compares two positions for equality.
     *
     * @param {LatLng} position1 Position 1
     * @param {LatLng} position2 Position 2
     * @return {Boolean} Result of comparison
     */
    MapUtility.equals = function(position1, position2) {
        return (MapUtility.lat(position1) === MapUtility.lat(position2)) &&
               (MapUtility.lng(position1) === MapUtility.lng(position2));
    };

    /**
     * Converts degrees into radians (radians = degrees * (Math.PI / 180)).
     *
     * @param {Number} deg Degrees
     * @return {Number} radians.
     */
    MapUtility.radiansFromDegrees = function(deg) {
        return deg * (Math.PI / 180);
    };

    /**
     * Calculates the rotation-angle between two given positions.
     *
     * @param {LatLng} start Start position.
     * @param {LatLng} end End position.
     * @return {Number} Rotation in radians.
     */
    MapUtility.rotationFromPositions = function(start, end) {
        return Math.atan2(MapUtility.lng(start) - MapUtility.lng(end), MapUtility.lat(start) - MapUtility.lat(end)) + (Math.PI / 2.0);
    };

    /**
     * Calculates the distance between two positions in kilometers.
     *
     * @param {LatLng} start Starting position
     * @param {LatLng} end End position
     * @return {Number} Distance in km
     */
    MapUtility.distanceBetweenPositions = function(start, end) {

        // Taken from: http://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371; // earths radius in km
        var lat1 = MapUtility.radiansFromDegrees(MapUtility.lat(start));
        var lat2 = MapUtility.radiansFromDegrees(MapUtility.lat(end));
        var deltaLat = MapUtility.radiansFromDegrees(MapUtility.lat(end) - MapUtility.lat(start));
        var deltaLng = MapUtility.radiansFromDegrees(MapUtility.lng(end) - MapUtility.lng(start));

        var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;
        return d;
    };

    module.exports = MapUtility;
});
