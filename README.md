famous-map
==========

Google Maps (V3) view for famo.us


## Usage

In your html file, include google maps:

    <head>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
    </head>


In your code, include

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

## Documentation

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