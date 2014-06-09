MapView
=======
MapView encapsulates a Google maps view so it can be used with famo.us.

Additionally it adds methods to set the position and zoom-factor of the map using transitions.
Use `MapModifier` and `MapStateModifier` to place famo.us renderables on the map, much like google-maps markers.


class MapView
-------------
**Methods**

MapView.getMap()
----------------
Get the internal map-object. This object may not yet have been initialized, the map is only
guarenteed to be valid after the 'load' event has been emited.



**Returns**

*Map*,  Google-maps Map object.

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

MapView.setZoom(zoom, \[transition\], \[callback\])
---------------------------------------------------
Set the zoom-level of the map.



**Parameters**

**zoom**:  *Number*,  Zoom-level for the map.

**[transition]**:  *Transitionable*,  Transitionable.

**[callback]**:  *Function*,  callback to call after transition completes.

MapView.getZoom()
-----------------
Get the current zoom-level of the map.



**Returns**

*Number*,  Zoom-level.

MapView.rotationFromPositions(start, end)
-----------------------------------------
Calculates the rotation-angle between two given positions.



**Parameters**

**start**:  *LatLng*,  Start position.

**end**:  *LatLng*,  End position.

**Returns**

*Number*,  Rotation in radians.

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



