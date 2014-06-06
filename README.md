# famous-map
==========

Google Maps (V3) view for famo.us


## Demo

TODO


## Installation

### Download famous-map

Clone repository:

	https://github.com/IjzerenHein/famous-map.git
	
Bower:

	TODO

### requireConfig.js

Tell require-js where to find 'famous-map':

	/*globals require*/
	require.config({
    	shim: {

    	},
    	paths: {
			'famous-map': '../famous-map',
        	famous: '../lib/famous',
	        requirejs: '../lib/requirejs/require',
    	    almond: '../lib/almond/almond',
        	'famous-polyfills': '../lib/polyfills/index'
	    }
	});
	require(['example']);
	
## Usage

### html

Include google maps:

    <head>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
    </head>

### famo.us code:

Create a MapView and wait for the 'load' event:

    var MapView = require('famous-map/MapView');

    // Create google-maps view with options.
    // Options: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapView = new MapView({
        zoom: 3,
        center: new google.maps.LatLng(51.4484855, 5.451478),
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    this.add(mapView);
    
    // Wait for the map to load and initialize
    mapView.on('load', function() {
    
        // As an example, pan across the globe using a transition
        mapView.panToLocation({
            new google.maps.LatLng(51.4484855, 5.451478),
            { duration: 5000 }
        });
    }.bind(this));

## API reference

|Class|Description|
|---|---|
|[MapView](docs/MapView.md)|View class which encapsulates a google-maps V3 map.|
|[MapItem](docs/MapItem.md)|Allows famo.us renderables to be placed as markers on the map.|



## License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.