class MapItemModifier
---------------------
**Methods**

MapItemModifier.positionFrom(position)
--------------------------------------
Set the geographical position on the map.



**Parameters**

**position**:  *LatLng*,  New position in geographical coordinates (Latitude, Longitude).

MapItemModifier.rotateTowardsFrom(rotateTowards)
------------------------------------------------
Set the geographical position to which to rotate towards.



**Parameters**

**rotateTowards**:  *LatLng*,  Position to which to point to.

MapItemModifier.zoomScaleFrom(zoomScale)
----------------------------------------
Set the base zoom-scale. When set the scale is increased when zooming in and
decreased when zooming-out.



**Parameters**

**zoomScale**:  *Number*,  Factor by which the scale is adjusted according to the map zoom-level.

MapItemModifier.zoomBaseFrom(zoomBase)
--------------------------------------
Set the base zoom-level. This options is ignored unless the zoomScale is set.
See zoomScale.



**Parameters**

**zoomBase**:  *Number*,  Map zoom-level

MapItemModifier.offsetFrom(displacement)
----------------------------------------
Set the displacement offset in geographical coordinates.



**Parameters**

**displacement**:  *LatLng*,  offset in geographical coordinates.

MapItemModifier.getPosition()
-----------------------------
Get the current geographical position.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapItemModifier.getRotateTowards()
----------------------------------
Get the geographical position to which to rotate to.



**Returns**

*LatLng*,  rotateTowards Position to which to point to.

MapItemModifier.getZoomScale()
------------------------------
TODO



MapItemModifier.getZoomBase()
-----------------------------
TODO



MapItemModifier.getOffset()
---------------------------
Get the geographical displacement offset.



**Returns**

*LatLng*,  Offset in geographical coordinates (Latitude, Longitude)

MapItemModifier.modify(target)
------------------------------
Return render spec for this MapItemModifier, applying to the provided
target component.  This is similar to render() for Surfaces.


which to apply the transform.
provided target


**Parameters**

**target**:  *Object*,  (already rendered) render spec to

**Returns**

*Object*,  render spec for this MapItemModifier, including the

