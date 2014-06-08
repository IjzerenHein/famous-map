famous-map
==========

Google Maps (V3) support for famo.us


## Demo

TODO


## Getting started

Download or clone the famous-map repository:

	https://github.com/IjzerenHein/famous-map.git

And add it to requireConfig.js:

	/*globals require*/
	require.config({
    	paths: {
    		...
			'famous-map': '../famous-map',
			...
	    }
	});
	require(['example']);
	
Include google-maps in the html file:

    <head>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
    </head>

Example of how to create a MapView:

    var MapView = require('famous-map/MapView');

    var mapView = new MapView({
    	mapOptions: {
	        zoom: 3,
    	    center: new google.maps.LatLng(51.4484855, 5.451478),
    	    mapTypeId: google.maps.MapTypeId.TERRAIN
    	}
    });
    this.add(mapView);
    
    // Wait for the map to load and initialize
    mapView.on('load', function () {
    
        // Move across the globe and zoom-in when done
        mapView.setPosition(
            new google.maps.LatLng(51.4484855, 5.451478),
            { duration: 5000 },
            function () {
        		mapView.setZoom(7);
           	}
        );
    }.bind(this));

## Documentation

To access the underlying google.maps.Map object, use MapView.getMap(). The Map-object
is only safely accessible after the 'load' event, because the DOM-object must first be created and google-maps need to load.

	mapView.on('load', function () {
		var map = mapView.getMap();
		...
	});

##### Panning & zooming the map using transitions

To pan the map using famo.us transitions, use MapView.setPosition().
Transitions are chained, so you can create paths that the map will follow.
Use MapView.setZoom() to zoom in and out using transitions or use MapView.getMap().setZoom() to use the standard Google Maps zoom behavior.

	mapView.setPosition(
		new google.maps.LatLng(51.4484855, 5.451478),
		{ duration: 5000, curve: Easing.outBack },
		function () {
			mapView.getMap().setZoom(7)
		}
	);
	mapView.setPosition(
		new google.maps.LatLng(51.4484855, 5.451478),
		{ duration: 5000 },
		function () {
			mapView.setZoom(3, { duration: 10000} )
		}
	);

##### Placing a renderable to a static position on the map

	MapItemModifier = require('famous-map/MapItemModifier');
	
	var surface = new Surface({
		size: [50, 50],
		properties: {
			backgroundColor: 'white'
		}
	});
	var modifier = new Modifier({
		align: [0, 0],
        origin: [0.5, 0.5]
	});
	var mapItemModifier = new MapItemModifier({
		position: new google.maps.LatLng(51.4484855, 5.451478)
	});
	this.add(mapItemModifier).add(modifier).add(surface);

##### Enable auto-scaling when the map is zoomed in or out

To enable auto-scaling set zoomBase to the zoom-level you wish the item to be displayed in its true size. In this example where zoomBase is set to 5, this would mean that at zoom-level 4 its size will 1/4 of its original size:

	var mapItemModifier = new MapItemModifier({
		position: new google.maps.LatLng(51.4484855, 5.451478),
		zoomBase: 5
	});

To use a different zooming strategy, use zoomScale. ZoomScale can be set to either a number or a getter function:

	var mapItemModifier = new MapItemModifier({
		position: new google.maps.LatLng(51.4484855, 5.451478),
		zoomBase: 5,
		zoomScale: 0.5
	});
	
	var mapItemModifier = new MapItemModifier({
		position: new google.maps.LatLng(51.4484855, 5.451478),
		zoomBase: 5,
		zoomScale: function (baseZoom, currentZoom) {
			var zoom = currentZoom - baseZoom;
            if (zoom < 0) {
            	return 1 / (2 * (Math.abs(zoom) + 1));
            } else {
            	return 1 + (2 * zoom);
            }
		}
	});

##### API reference

|Class|Description|
|---|---|
|[MapView](docs/MapView.md)|View class which encapsulates a google-maps V3 map.|
|[MapItemModifier](docs/MapItemModifier.md)|Stateless modifier which positions a renderable based on a geographical position {LatLng}.|
|[MapItemStateModifier](docs/MapItemStateModifier.md)|Modifier which positions a renderable based on a geographical position {LatLng}, using transitions.|
|[MapPositionTransitionable](docs/MapPositionTransitionable.md)|Transitionable for geographical coordinates {LatLng}.



## License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.