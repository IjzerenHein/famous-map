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
/*global define, google, L*/

define(function (require) {
    'use strict';
    
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Surface = require('famous/core/Surface');
    var RenderNode = require('famous/core/RenderNode');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Timer = require('famous/utilities/Timer');
    
    var MapView = require('famous-map/MapView');
    var MapModifier = require('famous-map/MapModifier');
    var MapStateModifier = require('famous-map/MapStateModifier');
    var MapUtility = require('famous-map/MapUtility');
    var MapPositionTransitionable = require('famous-map/MapPositionTransitionable');
    var MapTransition = require('famous-map/MapTransition');

    // Sample photo set
    var photos = [
        {loc: [-33.0752656, -71.5306995], img: "http://hispaniclondon.files.wordpress.com/2011/10/valparaiso.jpg"},
        {loc: [-19.9996424, -67], img: "http://i1-news.softpedia-static.com/images/news2/How-the-Andes-Mountains-Were-Generated-2.jpg"},
        {loc: [-24.7913296, -65.4268636], img: "http://www.fsdinternational.org/sites/default/files/public/salta20y.jpg"},
        {loc: [-24.7994937, -65.3327128], img: "http://www.agefotostock.com/previewimage/bajaage/a2cf1571e858f9ca288ce9c12cfc0d9c/IBR-2117612.jpg"},
        
        {loc: [-24.7631775, -65.4249721], img: "http://www.argentinaindependent.com/images/edition059/salta/salta04.jpg"},
        {loc: [-21.6629918, -64.4502754], img: "http://graphics8.nytimes.com/images/2013/05/14/world/BOLIVIA-1/BOLIVIA-1-articleLarge.jpg"},
        {loc: [-17.7125307, -64.7139473], img: "http://santafeselection.com/blog/wp-content/uploads/2014/01/Bolivia-woven-clothing-accessories.jpg"},
        {loc: [-13.822557, -66.8452949], img: "http://news.bbc.co.uk/media/images/46072000/jpg/_46072066_flags_afp.jpg"},
        {loc: [-12.976582, -71.426411], img: "http://static.guim.co.uk/sys-images/Travel/Pix/pictures/2008/11/14/JunglePaulASoudersCOrb4.jpg"},
        {loc: [-12.8587908, -73.535786], img: "http://blog.iamnikon.com/en_GB/wp-content/uploads/viapanam_peru_goldmining1600.jpg"},
        {loc: [-12.0553442, -77.0451853], img: "http://erikaearl.files.wordpress.com/2010/05/fukada_bangladesh.jpg"},
        {loc: [-3.3981796, -79.9538157], img: "http://www1.folha.uol.com.br/folha/turismo/images/20050421-equador470.jpg"},
        {loc: [4.6367492, -74.4826243], img: "http://www.eslfocus.com/newscontent/photos/article-lb-505.jpg"},
        
        {loc: [6.3426914, -67.4623606], img: "http://i1.ytimg.com/vi/TTe8XIyfpdc/0.jpg"},
        {loc: [5.2168707, -55.7948801], img: "http://upload.wikimedia.org/wikipedia/commons/5/5b/Bridge_over_Suriname_river_at_Afobaka_dam.JPG"},
        {loc: [3.8917523, -53.9381907], img: "http://media1.s-nbcnews.com/j/msnbc/Components/Photos/050909/050909_katrina_vmed_4p.grid-4x2.jpg"},
        {loc: [1.3457964, -50.7246896], img: "http://www.jetlinecruise.com/images/small-banner/Amazon-River-Aerial-View.jpg"},
        {loc: [-4.1326695, -50.3511544], img: "http://www.timeforkids.com/files/styles/tfk_rect_large/public/BRAZIL_SS4.jpg?itok=3Oi3PU3h"},
        {loc: [-4.7898483, -36.4204904], img: "http://allengeorgina.files.wordpress.com/2013/06/nature-of-brazil.jpg"},
        {loc: [-22.9156911, -43.449703], img: "http://blogimgs.only-apartments.com/images/only-apartments/6418/visit-rio-de-janeiro.jpg"},
        {loc: [-34.6158526, -58.4332985], img: "http://www.travel.com.au/dms/images/destination_images/buenosaires/buenosaires_1.jpg"}
    ];
    
    // create the main context
    var mainContext = Engine.createContext();
    
    // Determine map-type
    var mapType;
    try {
        var l = L;
        mapType = MapView.MapType.LEAFLET;
    } catch (err) {
        mapType = MapView.MapType.GOOGLEMAPS;
    }

    //
    // Create map-view
    //
    var zoom = 3;
    var center = {lat: -16.7351043, lng: -60.28125};
    var mapView;
    switch (mapType) {
    case MapView.MapType.LEAFLET:
        
        // Create leaflet map-view
        mapView = new MapView({
            type: mapType,
            mapOptions: {
                zoom: zoom,
                center: center
            }
        });
        break;
    case MapView.MapType.GOOGLEMAPS:
        
        // Create google-maps map-view
        mapView = new MapView({
            type: mapType,
            mapOptions: {
                zoom: zoom,
                center: center,
                disableDefaultUI: false,
                disableDoubleClickZoom: true,
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                minZoom: 3
            }
        });
        break;
    }
    mainContext.add(mapView);
    
    //
    // Create title
    //
    var title = new Surface({
        size: [true, true],
        content: 'famous-map photos',
        classes: ['title']
    });
    var titleModifier = new Modifier({
        align: [0.5, 0],
        origin: [0.5, 0],
        transform: Transform.translate(0, 20, 0)
    });
    mainContext.add(titleModifier).add(title);
        
    /**
     * Creates a photo-marker
     */
    function _createPhotoMarker(photo) {
        var randomAngle = (Math.PI / 180) * (10 - (Math.random() * 20));
        var marker = {
            mapModifier: new MapModifier({
                mapView: mapView,
                position: photo.loc
            }),
            modifier: new StateModifier({
                align: [0, 0],
                origin: [0.5, 0.5]
            }),
            content: {
                modifier: new Modifier({
                    size: [36, 26],
                    transform: Transform.rotateZ(randomAngle)
                }),
                back: new Surface({
                    classes: ['photo-frame']
                }),
                photoModifier: new Modifier({
                    origin: [0.5, 0.5],
                    align: [0.5, 0.5],
                    transform: Transform.scale(0.86, 0.78, 1)
                }),
                photo: new ImageSurface({
                    classes: ['photo']
                })
            }
        };
        marker.renderable = new RenderNode(marker.mapModifier);
        var renderable = marker.renderable.add(marker.modifier).add(marker.content.modifier);
        renderable.add(marker.content.back);
        renderable.add(marker.content.photoModifier).add(marker.content.photo);
        return marker;
    }
    
    //
    // Wait for the map to load and initialize
    //
    mapView.on('load', function () {

        // Add Leaflet tile-layer
        if (mapType === MapView.MapType.LEAFLET) {
            L.tileLayer('http://{s}.tiles.mapbox.com/v3/ijzerenhein.iil33fn1/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
                //maxZoom: 18
            }).addTo(mapView.getMap());
        }
        
        // Wait a little bit and let the map load some tiles, before doing the photo animation
        Timer.setTimeout(function () {
        
            // Create (almost) transparent markers.
            // The markers are created with correct dimensions but transparent,
            // so that they are correctly displayed on Android devices.
            var i, j, markers = [];
            for (i = 0; i < photos.length; i++) {
                var marker = _createPhotoMarker(photos[i]);
                markers.push(marker);
                marker.modifier.setOpacity(0.01);
                mainContext.add(marker.renderable);
            }

            // Wait for the rendering to occur and then show the marker with an expand animation.
            // If we don't then we trigger the eager optimisation bug on Android.
            var interPhotoDelay = 50;
            var photoZoomDuration = 500;
            Timer.after(function () {
                var j;
                for (j = 0; j < markers.length; j++) {
                    var marker = markers[j];
                    marker.modifier.setTransform(Transform.scale(0, 0, 1));
                    marker.modifier.setOpacity(1);
                    marker.modifier.setTransform(
                        Transform.scale(0.01, 0.01, 1),
                        {duration: j * interPhotoDelay}
                    );
                    marker.modifier.setTransform(
                        Transform.scale(1, 1, 1),
                        {duration: photoZoomDuration, curve: Easing.outBack}
                    );
                }
            }, 5);

            // Wait for all animations to complete before loading the images.
            // Loading the images is done is the same thread by the browser and therefore greatly affects
            // javascript execution and rending.
            Timer.setTimeout(function () {
                var j;
                for (j = 0; j < markers.length; j++) {
                    var marker = markers[j];
                    marker.content.photo.setContent(photos[j].img);
                }
            }.bind(this), (markers.length * interPhotoDelay) + photoZoomDuration);
        }, 200);
    });
});
