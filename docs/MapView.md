<a name="module_MapView"></a>
##MapView(options)

MapView encapsulates a Google maps view so it can be used with famo.us.

Additionally it adds methods to set the position and zoom-factor of the map using transitions.
Use `MapModifier` and `MapStateModifier` to place famo.us renderables on the map, much like google-maps markers.

**Map-types**

|Value|Description|
|---|---|
|MapType.GOOGLEMAPS (default)|Google-maps.|
|MapType.LEAFLET|Leaflet.js.|

**Params**
- options `Object` - Options.
  - type `MapType` - Map-type (e.g. MapView.MapType.GOOGLEMAPS, MapView.MapType.LEAFLET).
  - mapOptions `Object` - Options that are passed directly to the Map object. The options should include the 'center' and 'zoom'.
  - [id] `String` - Id of the DOM-element to use. When ommitted, a DOM-element is created using a surface.
  - [zoomTransition] `Transition` - Transition to use for smoothly zooming renderables (by default a transition of 120 ms is used).

  
**Contents**
* [getMap()](#module_MapView.getMap)
* [setPosition(position, [transition], [callback])](#module_MapView.setPosition)
* [getPosition()](#module_MapView.getPosition)
* [getFinalPosition()](#module_MapView.getFinalPosition)
* [getZoom()](#module_MapView.getZoom)
* [pointFromPosition(Position)](#module_MapView.pointFromPosition)
* [positionFromPoint(point)](#module_MapView.positionFromPoint)
* [getSize()](#module_MapView.getSize)
* [halt()](#module_MapView.halt)
* [isActive()](#module_MapView.isActive)

<a name="module_MapView.getMap"></a>
###getMap()
Get the internal map-object. This object may not yet have been initialized, the map is only
guarenteed to be valid after the 'load' event has been emited.

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `Map` - Map object.  
<a name="module_MapView.setPosition"></a>
###setPosition(position, [transition], [callback])
Set the center of the map to the given geographical coordinates.

**Params**
- position `LatLng` - Position in geographical coordinates.
- [transition] `Transitionable` - Transitionable.
- [callback] `function` - callback to call after transition completes.

**Scope**: inner function of [MapView](#module_MapView)  
<a name="module_MapView.getPosition"></a>
###getPosition()
Get the current center position of the map, in geographical coordinates.

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `LatLng` - Position in geographical coordinates.  
<a name="module_MapView.getFinalPosition"></a>
###getFinalPosition()
Get the destination center position of the map, in geographical coordinates.

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `LatLng` - Position in geographical coordinates.  
<a name="module_MapView.getZoom"></a>
###getZoom()
Get the current zoom-level of the map, taking into account smooth transition between zoom-levels. 
E.g., when zooming from zoom-level 4 to 5, this function returns an increasing value starting at 4 and ending
at 5, over time. The used zoomTransition can be set as an option.

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `Number` - Zoom-level.  
<a name="module_MapView.pointFromPosition"></a>
###pointFromPosition(Position)
Get the position in pixels (relative to the left-top of the container) for the given geographical position.

**Params**
- Position `LatLng` - in geographical coordinates.

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `Point` - Position in pixels, relative to the left-top of the mapView.  
<a name="module_MapView.positionFromPoint"></a>
###positionFromPoint(point)
Get the geographical coordinates for a given position in pixels (relative to the left-top of the container).

**Params**
- point `Point` - Position in pixels, relative to the left-top of the mapView.

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `LatLng` - Position in geographical coordinates.  
<a name="module_MapView.getSize"></a>
###getSize()
Get the size of the map-view in pixels.

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `Array.Number` - Size of the mapView.  
<a name="module_MapView.halt"></a>
###halt()
Halts any pending transitions.

**Scope**: inner function of [MapView](#module_MapView)  
<a name="module_MapView.isActive"></a>
###isActive()
Is there at least one action pending completion?

**Scope**: inner function of [MapView](#module_MapView)  
**Returns**: `Bool` - True when there are active transitions running.  
