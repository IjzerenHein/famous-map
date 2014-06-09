class MapItemStateModifier
--------------------------
**Methods**

MapItemStateModifier.setPosition(position, \[transition\], \[callback\])
------------------------------------------------------------------------
Set the geographical position, by adding the new position to the queue of transitions.



**Parameters**

**position**:  *LatLng*,  New position in geographical coordinates (Latitude, Longitude).

**[transition]**:  *Transition*,  Famo.us transitionable object.

**[callback]**:  *Function*,  callback to call after transition completes.

MapItemStateModifier.setZoomScale(zoomScale)
--------------------------------------------
Set the base zoom-scale. When set the scale is increased when zooming in and
decreased when zooming-out.



**Parameters**

**zoomScale**:  *Number*,  Factor by which the scale is adjusted according to the map zoom-level.

MapItemStateModifier.zoomBaseFrom(zoomBase)
-------------------------------------------
Set the base zoom-level. This options is ignored unless the zoomScale is set.
See zoomScale.



**Parameters**

**zoomBase**:  *Number*,  Map zoom-level

MapItemStateModifier.offsetFrom(displacement)
---------------------------------------------
Set the displacement offset in geographical coordinates.



**Parameters**

**displacement**:  *LatLng*,  offset in geographical coordinates.

MapItemStateModifier.getPosition()
----------------------------------
Get the current geographical position.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapItemStateModifier.getRotateTowards()
---------------------------------------
Get the geographical position to which the rotation is set towards.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapItemStateModifier.getFinalPosition()
---------------------------------------
Get the destination geographical position.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapItemStateModifier.getFinalRotateTowards()
--------------------------------------------
Get the destination geographical position to which the rotation is set towards.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapItemStateModifier.getZoomScale()
-----------------------------------
TODO



MapItemStateModifier.getZoomBase()
----------------------------------
TODO



MapItemStateModifier.getOffset()
--------------------------------
Get the geographical displacement offset.



**Returns**

*LatLng*,  Offset in geographical coordinates (Latitude, Longitude)

MapItemStateModifier.halt()
---------------------------
Halts any pending transitions.



MapItemStateModifier.isActive()
-------------------------------
Is there at least one transition pending completion?



**Returns**

*Bool*,  True when there are active transitions running.

MapItemStateModifier.modify(target)
-----------------------------------
Return render spec for this StateModifier, applying to the provided
target component.  This is similar to render() for Surfaces.


which to apply the transform.
provided target


**Parameters**

**target**:  *Object*,  (already rendered) render spec to

**Returns**

*Object*,  render spec for this StateModifier, including the

