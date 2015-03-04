/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*eslint no-unused-vars:0*/
define(function(require) {
    'use strict';

    // Put all modules that are to be included in the minified result here.
    // It's important to not forget any modules, if so than these modules
    // will not be accessible through 'famous-map/..'.
    var v = require('famous-map/MapView');
    v = require('famous-map/MapModifier');
    v = require('famous-map/MapStateModifier');
    v = require('famous-map/MapUtility');
    v = require('famous-map/MapPositionTransitionable');
    v = require('famous-map/MapTransition');
});
