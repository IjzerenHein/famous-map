MapView
=======
MapView encapsulates a Google maps view so it can be used with famo.us.

Additionally it adds methods to set the position and zoom-factor of the map using transitions.
Use `MapModifier` and `MapStateModifier` to place famo.us renderables on the map, much like google-maps markers.

### Options

**type**: Map-type (e.g. MapView.MapType.GOOGLEMAPS, MapView.MapType.LEAFLET)

**mapOptions**: Options that are passed directly to the google.maps.Map object. The options should include the 'center' and 'zoom'.

**[id]**: Id of the DOM-element to use. When ommitted, a DOM-element is created using a surface.

**[zoomTransition]**: Transition to use for smoothly zooming renderables (by default a transition of 120 ms is used).

### Map-types

|Value|Description|
|---|---|
|MapType.GOOGLEMAPS (default)|Google-maps.|
|MapType.LEAFLET|Leaflet.js.|



class MapView
-------------
**Methods**

MapView.getMap()
----------------
Get the internal map-object. This object may not yet have been initialized, the map is only
guarenteed to be valid after the 'load' event has been emited.



**Returns**

*Map*,  Map object.

MapView.setPosition(position, \[transition\], \[callback\])
-----------------------------------------------------------
Set the center of the map to the given geographical coordinates.



**Parameters**

**position**:  *LatLng*,  Position in geographical coordinates.

**[transition]**:  *Transitionable*,  Transitionable.

**[callback]**:  *Function*,  callback to call after transition completes.

MapView.getPosition()
---------------------
Get the current center position of the map, in geographical coordinates.



**Returns**

*LatLng*,  Position in geographical coordinates.

MapView.getFinalPosition()
--------------------------
Get the destination center position of the map, in geographical coordinates.



**Returns**

*LatLng*,  Position in geographical coordinates.

MapView.getZoom()
-----------------
Get the current zoom-level of the map, taking into account smooth transition between zoom-levels.
E.g., when zooming from zoom-level 4 to 5, this function returns an increasing value starting at 4 and ending
at 5, over time. The used zoomTransition can be set as an option.



**Returns**

*Number*,  Zoom-level.

MapView.pointFromPosition(Position)
-----------------------------------
Get the position in pixels (relative to the left-top of the container) for the given geographical position.



**Parameters**

**Position**:  *LatLng*,  in geographical coordinates.

**Returns**

*Point*,  Position in pixels, relative to the left-top of the mapView.

MapView.positionFromPoint(point)
--------------------------------
Get the geographical coordinates for a given position in pixels (relative to the left-top of the container).



**Parameters**

**point**:  *Point*,  Position in pixels, relative to the left-top of the mapView.

**Returns**

*LatLng*,  Position in geographical coordinates.

MapView.getSize()
-----------------
Get the size of the map-view in pixels.



**Returns**

*Array.Number*,  Size of the mapView.

MapView.halt()
--------------
Halts any pending transitions.



MapView.isActive()
------------------
Is there at least one action pending completion?



**Returns**

*Bool*,  True when there are active transitions running.

MapView.render()
----------------
Renders the view.



