MapStateModifier
================
The MapStateModifier makes it possible to link renderables to a geopgraphical position on a `MapView`.
Additionally it adds functionality for rotating and zooming renderables, and possibly all kinds of future
map-related transformations.

The MapStateModifier makes it possible to use transitions to e.g. move a renderable from one geographical
position to another. If the renderable doesn't require transitions, the use of the lightweight
and stateless `MapModifier` is strongly preferred.

### Options

**mapView**: {MapView} The MapView.

**[position]**: {LatLng} Initial geographical coordinates.

**[offset]**: {LatLng} Displacement offset in geographical coordinates from the position.

**[rotateTowards]**: {LatLng} Position to rotate the renderables towards.

**[zoomBase]**: {Number} Base zoom-level at which the renderables are displayed in their true size.

**[zoomScale]**: {Number, Function} Customer zoom-scaling factor or function.


class MapModifier
-----------------
**Methods**

MapModifier.constructor(options)
--------------------------------
**Parameters**

**options**:  *Object*,  Options.

MapModifier.setPosition(position, \[transition\], \[callback\])
---------------------------------------------------------------
Set the geographical position of the renderables, by adding the new position to the chain of transitions.



**Parameters**

**position**:  *LatLng*,  New position in geographical coordinates (Latitude, Longitude).

**[transition]**:  *Transition*,  Famo.us transitionable object.

**[callback]**:  *Function*,  callback to call after transition completes.

MapModifier.rotateTowards(position, \[transition\], \[callback\])
-----------------------------------------------------------------
Set the destination geographical position to rotate the renderables towards, by adding them.
to the chain of transitions.
The child renderables are assumed to be rotated to the right by default.
To change the base rotation, add a rotation-transform to the renderable, like this:
`new Modifier({transform: Transform.rotateZ(Math.PI/2)})`



**Parameters**

**position**:  *LatLng*,  Destination position in geographical position to rotate towards.

**[transition]**:  *Transition*,  Famo.us transitionable object.

**[callback]**:  *Function*,  callback to call after transition completes.

MapModifier.setZoomBase(zoomBase)
---------------------------------
Set the base zoom-level. When set, auto-zooming is effecitvely enabled.
The renderables are then displayed in their true size when the map zoom-level equals zoomBase.



**Parameters**

**zoomBase**:  *Number*,  Map zoom-level

MapModifier.setZoomScale(zoomScale)
-----------------------------------
Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and
decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
a scale-factor, with the following signature: function (zoomBase, zoomCurrent).



**Parameters**

**zoomScale**:  *Number,Function*,  Zoom-scale factor or function.

MapModifier.setOffset(offset)
-----------------------------
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
Get the geographical position towards which the renderables are currently rotated.



**Returns**

*LatLng*,  Destination geographical position towards which renderables are rotated.

MapModifier.getFinalPosition()
------------------------------
Get the destination geographical position.



**Returns**

*LatLng*,  Position in geographical coordinates.

MapModifier.getFinalRotateTowards()
-----------------------------------
Get the destination geographical position which the renderables should be rotated towards.



**Returns**

*LatLng*,  Position in geographical coordinates.

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

MapModifier.halt()
------------------
Halts any pending transitions.



MapModifier.isActive()
----------------------
Is there at least one transition pending completion?



**Returns**

*Bool*,  True when there are active transitions running.

MapModifier.modify(target)
--------------------------
Return render spec for this StateModifier, applying to the provided
target component.  This is similar to render() for Surfaces.


which to apply the transform.
provided target


**Parameters**

**target**:  *Object*,  (already rendered) render spec to

**Returns**

*Object*,  render spec for this StateModifier, including the

