<a name="module_MapView"></a>
## MapView
MapView encapsulates a Google maps view so it can be used with famo.us.

Additionally it adds methods to set the position and zoom-factor of the map using transitions.
Use `MapModifier` and `MapStateModifier` to place famo.us renderables on the map, much like google-maps markers.

**Map-types**

|Value|Description|
|---|---|
|MapType.GOOGLEMAPS (default)|Google-maps|
|MapType.LEAFLET|Leaflet.js|
|MapType.OPENLAYERS3|Open layers 3|


* [MapView](#module_MapView)
  * [MapView](#exp_module_MapView--MapView) ⏏
    * [new MapView(options)](#new_module_MapView--MapView_new)
    * _instance_
      * [.getMap()](#module_MapView--MapView#getMap) ⇒ <code>Map</code>
      * [.isInitialized()](#module_MapView--MapView#isInitialized) ⇒ <code>Bool</code>
      * [.setPosition(position, [transition], [callback])](#module_MapView--MapView#setPosition)
      * [.getPosition()](#module_MapView--MapView#getPosition) ⇒ <code>LatLng</code>
      * [.getFinalPosition()](#module_MapView--MapView#getFinalPosition) ⇒ <code>LatLng</code>
      * [.getZoom()](#module_MapView--MapView#getZoom) ⇒ <code>Number</code>
      * [.getRotation()](#module_MapView--MapView#getRotation) ⇒ <code>Number</code>
      * [.pointFromPosition(position)](#module_MapView--MapView#pointFromPosition) ⇒ <code>Point</code>
      * [.positionFromPoint(point)](#module_MapView--MapView#positionFromPoint) ⇒ <code>LatLng</code>
      * [.getSize()](#module_MapView--MapView#getSize) ⇒ <code>Array.Number</code>
      * [.halt()](#module_MapView--MapView#halt)
      * [.isActive()](#module_MapView--MapView#isActive) ⇒ <code>Bool</code>
    * _static_
      * [.installSelectiveTouchMoveHandler()](#module_MapView--MapView.installSelectiveTouchMoveHandler)

<a name="exp_module_MapView--MapView"></a>
### MapView ⏏
**Kind**: Exported class  
<a name="new_module_MapView--MapView_new"></a>
#### new MapView(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options. |
| options.type | <code>MapType</code> | Map-type (e.g. MapView.MapType.GOOGLEMAPS, MapView.MapType.LEAFLET, MapView.MapType.OPENLAYERS3). |
| options.mapOptions | <code>Object</code> | Options that are passed directly to the Map object. The options should include the 'center' and 'zoom'. |
| [options.id] | <code>String</code> | Id of the DOM-element to use. When ommitted, a DOM-element is created using a surface. |
| [options.zoomTransition] | <code>Transition</code> | Transition to use for smoothly zooming renderables (by default a transition of 120 ms is used). |

<a name="module_MapView--MapView#getMap"></a>
#### mapView.getMap() ⇒ <code>Map</code>
Get the internal map-object. This object may not yet have been initialized, the map is only
guarenteed to be valid after the 'load' event has been emited.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>Map</code> - Map object.  
<a name="module_MapView--MapView#isInitialized"></a>
#### mapView.isInitialized() ⇒ <code>Bool</code>
Returns `true` when the map-view has been fully initialized.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>Bool</code> - true/false.  
<a name="module_MapView--MapView#setPosition"></a>
#### mapView.setPosition(position, [transition], [callback])
Set the center of the map to the given geographical coordinates.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> | Position in geographical coordinates. |
| [transition] | <code>Transitionable</code> | Transitionable. |
| [callback] | <code>function</code> | callback to call after transition completes. |

<a name="module_MapView--MapView#getPosition"></a>
#### mapView.getPosition() ⇒ <code>LatLng</code>
Get the current center position of the map, in geographical coordinates.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>LatLng</code> - Position in geographical coordinates.  
<a name="module_MapView--MapView#getFinalPosition"></a>
#### mapView.getFinalPosition() ⇒ <code>LatLng</code>
Get the destination center position of the map, in geographical coordinates.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>LatLng</code> - Position in geographical coordinates.  
<a name="module_MapView--MapView#getZoom"></a>
#### mapView.getZoom() ⇒ <code>Number</code>
Get the current zoom-level of the map, taking into account smooth transition between zoom-levels.
E.g., when zooming from zoom-level 4 to 5, this function returns an increasing value starting at 4 and ending
at 5, over time. The used zoomTransition can be set as an option.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>Number</code> - Zoom-level.  
<a name="module_MapView--MapView#getRotation"></a>
#### mapView.getRotation() ⇒ <code>Number</code>
Get the rotation of the map. 0 means north-up.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>Number</code> - Rotation in radians.  
<a name="module_MapView--MapView#pointFromPosition"></a>
#### mapView.pointFromPosition(position) ⇒ <code>Point</code>
Get the position in pixels (relative to the left-top of the container) for the given geographical position.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>Point</code> - Position in pixels, relative to the left-top of the mapView.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> | in geographical coordinates. |

<a name="module_MapView--MapView#positionFromPoint"></a>
#### mapView.positionFromPoint(point) ⇒ <code>LatLng</code>
Get the geographical coordinates for a given position in pixels (relative to the left-top of the container).

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>LatLng</code> - Position in geographical coordinates.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Point</code> | Position in pixels, relative to the left-top of the mapView. |

<a name="module_MapView--MapView#getSize"></a>
#### mapView.getSize() ⇒ <code>Array.Number</code>
Get the size of the map-view in pixels.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>Array.Number</code> - Size of the mapView.  
<a name="module_MapView--MapView#halt"></a>
#### mapView.halt()
Halts any pending transitions.

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
<a name="module_MapView--MapView#isActive"></a>
#### mapView.isActive() ⇒ <code>Bool</code>
Is there at least one action pending completion?

**Kind**: instance method of <code>[MapView](#exp_module_MapView--MapView)</code>  
**Returns**: <code>Bool</code> - True when there are active transitions running.  
<a name="module_MapView--MapView.installSelectiveTouchMoveHandler"></a>
#### MapView.installSelectiveTouchMoveHandler()
Installs the selective touch-move handler so that Google Maps
can be correctly used with touch events (mobile).

Install this handler before creating the main Context:
```javascript
var Engine = require('famous/core/Engine');
var MapView = require('famous-map/MapView');
var isMobile = require('ismobilejs');

if (isMobile.any) {
  Engine.setOptions({appMode: false});
  MapView.installSelectiveTouchMoveHandler();
}

var mainContext = Engine.createContext();
...
```

**Kind**: static method of <code>[MapView](#exp_module_MapView--MapView)</code>  
