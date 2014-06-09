class MapView
-------------
**Methods**

MapView.getMap()
----------------
Gets the internal map-object. This object may not yet have been initialized.
The object is guarenteed to be valid after the 'load' event has been emited.



**Returns**

*Map*,  Map object.

MapView.setPosition(position, \[transition\], \[callback\])
-----------------------------------------------------------
Set the center of the map to the given geographical coordinates (Latitude, Longitude).



**Parameters**

**position**:  *LatLng*,  Position in geographical coordinates (Latitude, Longitude).

**[transition]**:  *Transitionable*,  Famo.us transitionable object.

**[callback]**:  *Function*,  callback to call after transition completes.

MapView.getPosition()
---------------------
Get the current center position of the map.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapView.getFinalPosition()
--------------------------
Get the destination center position of the map.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapView.setZoom(zoom, \[transition\], \[callback\])
---------------------------------------------------
Set the zoom-level.



**Parameters**

**zoom**:  *Number*,  Zoom-level for the map (0 = zoomed-out), must be a whole number.

**[transition]**:  *Transitionable*,  Famo.us transitionable object.

**[callback]**:  *Function*,  callback to call after transition completes.

MapView.getZoom()
-----------------
Get the current zoom- factor.



**Returns**

*Number*,  Current zoom- factor

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
Get the position in pixels, relative to the left-top of the container, for the given geographical position.



**Parameters**

**Position**:  *LatLng*,  in geographical coordinates (Latitude, Longitude).

**Returns**

*Point*,  Position in pixels, relative to the left-top of the mapView.

MapView.positionFromPoint(point)
--------------------------------
Get the geographical coordinates for a given position in pixels, relative to the left-top of the container.



**Parameters**

**point**:  *Point*,  Position in pixels, relative to the left-top of the mapView.

**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude).

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



