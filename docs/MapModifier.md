MapModifier
===========
The MapModifier makes it possible to link renderables to a geopgraphical position on a `MapView`.
Additionally it adds functionality for rotating and zooming renderables, and possibly all kinds of future
map-related transformations.

Use `MapStateModifier` if you want to use transitions, e.g. to animate a move from one geographical position
to another.

### Options

**mapView**: {MapView} The MapView.

**[position]**: {LatLng} Initial geographical coordinates.

**[offset]**: {LatLng} Displacement offset in geographical coordinates from the position.

**[rotateTowards]**: {LatLng, Object, Function} Position to rotate the renderables towards.

**[zoomBase]**: {Number} Base zoom-level at which the renderables are displayed in their true size.

**[zoomScale]**: {Number, Function} Customer zoom-scaling factor or function.


class MapModifier
-----------------
**Methods**

MapModifier.constructor(options)
--------------------------------
**Parameters**

**options**:  *Object*,  Options.

MapModifier.positionFrom(position)
----------------------------------
Set the geographical position of the renderables.



**Parameters**

**position**:  *LatLng*,  Position in geographical coordinates.

MapModifier.rotateTowardsFrom(position)
---------------------------------------
Set the geographical position to rotate the renderables towards.
The child renderables are assumed to be rotated to the right by default.
To change the base rotation, add a rotation-transform to the renderable, like this:
`new Modifier({transform: Transform.rotateZ(Math.PI/2)})`



**Parameters**

**position**:  *LatLng*,  Geographical position to rotate towards.

MapModifier.zoomBaseFrom(zoomBase)
----------------------------------
Set the base zoom-level. When set, auto-zooming is effecitvely enabled.
The renderables are then displayed in their true size when the map zoom-level equals zoomBase.



**Parameters**

**zoomBase**:  *Number*,  Map zoom-level

MapModifier.zoomScaleFrom(zoomScale)
------------------------------------
Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and
decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
a scale-factor, with the following signature: function (zoomBase, zoomCurrent).



**Parameters**

**zoomScale**:  *Number,Function*,  Zoom-scale factor or function.

MapModifier.offsetFrom(offset)
------------------------------
Set the displacement offset in geographical coordinates.



**Parameters**

**offset**:  *LatLng*,  Displacement offset in geographical coordinates.

MapModifier.getPosition()
-------------------------
Get the current geographical position.



**Returns**

*LatLng*,  Position in geographical coordinates.

MapModifier.getRotateTowards()
------------------------------
Get the geographical position towards which the renderables are rotated.



**Returns**

*LatLng*,  Geographical position towards which renderables are rotated.

MapModifier.getZoomBase()
-------------------------
Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
displayed in their true size.



**Returns**

*Number*,  Base zoom level

MapModifier.getZoomScale()
--------------------------
Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
a scale-factor.



**Returns**

*Number, Function*,  Zoom-scale

MapModifier.getOffset()
-----------------------
Get the geographical displacement offset.



**Returns**

*LatLng*,  Offset in geographical coordinates.

MapModifier.modify(target)
--------------------------
Return render spec for this MapModifier, applying to the provided
target component.  This is similar to render() for Surfaces.


which to apply the transform.
provided target


**Parameters**

**target**:  *Object*,  (already rendered) render spec to

**Returns**

*Object*,  render spec for this MapModifier, including the

