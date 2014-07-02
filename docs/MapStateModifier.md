<a name="module_MapStateModifier"></a>
##MapStateModifier(options)

The MapStateModifier makes it possible to use transitions to e.g. move a renderable from one geographical
position to another. If the renderable doesn't require transitions, the use of the lightweight 
and stateless `MapModifier` is strongly preferred.

**Params**
- options `Object` - Options.
  - mapView `MapView` - The MapView.
  - [position] `LatLng` - Initial geographical coordinates.
  - [offset] `LatLng` - Displacement offset in geographical coordinates from the position.
  - [rotateTowards] `LatLng` - Position to rotate the renderables towards.
  - [zoomBase] `number` - Base zoom-level at which the renderables are displayed in their true size.
  - [zoomScale] `number` | `function` - Custom zoom-scaling factor or function.

  
**Contents**  
* [setPosition(position, [transition], [callback])](#module_MapStateModifier#setPosition)
* [rotateTowards(position, [transition], [callback])](#module_MapStateModifier#rotateTowards)
* [setZoomBase(zoomBase)](#module_MapStateModifier#setZoomBase)
* [setZoomScale(zoomScale)](#module_MapStateModifier#setZoomScale)
* [setOffset(offset)](#module_MapStateModifier#setOffset)
* [getPosition()](#module_MapStateModifier#getPosition)
* [getRotateTowards()](#module_MapStateModifier#getRotateTowards)
* [getFinalPosition()](#module_MapStateModifier#getFinalPosition)
* [getFinalRotateTowards()](#module_MapStateModifier#getFinalRotateTowards)
* [getZoomBase()](#module_MapStateModifier#getZoomBase)
* [getZoomScale()](#module_MapStateModifier#getZoomScale)
* [getOffset()](#module_MapStateModifier#getOffset)
* [halt()](#module_MapStateModifier#halt)
* [isActive()](#module_MapStateModifier#isActive)

<a name="module_MapStateModifier#setPosition"></a>
###mapStateModifier.setPosition(position, [transition], [callback])
Set the geographical position of the renderables, by adding the new position to the chain of transitions.

**Params**
- position `LatLng` - New position in geographical coordinates (Latitude, Longitude).
- [transition] `Transition` - Famo.us transitionable object.
- [callback] `function` - callback to call after transition completes.

<a name="module_MapStateModifier#rotateTowards"></a>
###mapStateModifier.rotateTowards(position, [transition], [callback])
Set the destination geographical position to rotate the renderables towards, by adding them.
to the chain of transitions.
The child renderables are assumed to be rotated to the right by default.
To change the base rotation, add a rotation-transform to the renderable, like this: 
`new Modifier({transform: Transform.rotateZ(Math.PI/2)})`

**Params**
- position `LatLng` - Destination position in geographical position to rotate towards.
- [transition] `Transition` - Famo.us transitionable object.
- [callback] `function` - callback to call after transition completes.

<a name="module_MapStateModifier#setZoomBase"></a>
###mapStateModifier.setZoomBase(zoomBase)
Set the base zoom-level. When set, auto-zooming is effectively enabled.
The renderables are then displayed in their true size when the map zoom-level equals zoomBase.

**Params**
- zoomBase `Number` - Map zoom-level

<a name="module_MapStateModifier#setZoomScale"></a>
###mapStateModifier.setZoomScale(zoomScale)
Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and 
decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
a scale-factor, with the following signature: function (zoomBase, zoomCurrent).

**Params**
- zoomScale `Number` | `function` - Zoom-scale factor or function.

<a name="module_MapStateModifier#setOffset"></a>
###mapStateModifier.setOffset(offset)
Set the displacement offset in geographical coordinates.

**Params**
- offset `LatLng` - Displacement offset in geographical coordinates.

<a name="module_MapStateModifier#getPosition"></a>
###mapStateModifier.getPosition()
Get the current geographical position.

**Returns**: `LatLng` - Position in geographical coordinates.  
<a name="module_MapStateModifier#getRotateTowards"></a>
###mapStateModifier.getRotateTowards()
Get the geographical position towards which the renderables are currently rotated.

**Returns**: `LatLng` - Destination geographical position towards which renderables are rotated.  
<a name="module_MapStateModifier#getFinalPosition"></a>
###mapStateModifier.getFinalPosition()
Get the destination geographical position.

**Returns**: `LatLng` - Position in geographical coordinates.  
<a name="module_MapStateModifier#getFinalRotateTowards"></a>
###mapStateModifier.getFinalRotateTowards()
Get the destination geographical position which the renderables should be rotated towards.

**Returns**: `LatLng` - Position in geographical coordinates.  
<a name="module_MapStateModifier#getZoomBase"></a>
###mapStateModifier.getZoomBase()
Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
displayed in their true size.

**Returns**: `Number` - Base zoom level  
<a name="module_MapStateModifier#getZoomScale"></a>
###mapStateModifier.getZoomScale()
Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
a scale-factor.

**Returns**: `Number` | `function` - Zoom-scale  
<a name="module_MapStateModifier#getOffset"></a>
###mapStateModifier.getOffset()
Get the geographical displacement offset.

**Returns**: `LatLng` - Offset in geographical coordinates.  
<a name="module_MapStateModifier#halt"></a>
###mapStateModifier.halt()
Halts any pending transitions.

<a name="module_MapStateModifier#isActive"></a>
###mapStateModifier.isActive()
Is there at least one transition pending completion?

**Returns**: `Bool` - True when there are active transitions running.  
