<a name="module_MapModifier"></a>
##MapModifier(options)

The MapModifier makes it possible to link renderables to a geopgraphical position on a `MapView`.
Additionally it adds functionality for rotating and zooming renderables, and possibly all kinds of future  map-related transformations.
Use `MapStateModifier` if you want to use transitions, e.g. to animate a move from one geographical position to another.

**Params**
- options `Object` - Options.
  - mapView `MapView` - The MapView.
  - [position] `LatLng` - Initial geographical coordinates.
  - [offset] `LatLng` - Displacement offset in geographical coordinates from the position.
  - [rotateTowards] `LatLng` | `object` | `function` - Position to rotate the renderables towards.
  - [zoomBase] `number` - Base zoom-level at which the renderables are displayed in their true size.
  - [zoomScale] `number` | `function` - Customer zoom-scaling factor or function.

  
**Contents**
* [positionFrom(position)](#module_MapModifier.positionFrom)
* [rotateTowardsFrom(position)](#module_MapModifier.rotateTowardsFrom)
* [zoomBaseFrom(zoomBase)](#module_MapModifier.zoomBaseFrom)
* [zoomScaleFrom(zoomScale)](#module_MapModifier.zoomScaleFrom)
* [offsetFrom(offset)](#module_MapModifier.offsetFrom)
* [getPosition()](#module_MapModifier.getPosition)
* [getRotateTowards()](#module_MapModifier.getRotateTowards)
* [getZoomBase()](#module_MapModifier.getZoomBase)
* [getZoomScale()](#module_MapModifier.getZoomScale)
* [getOffset()](#module_MapModifier.getOffset)

<a name="module_MapModifier.positionFrom"></a>
###positionFrom(position)
Set the geographical position of the renderables.

**Params**
- position `LatLng` | `function` | `Object` - Position in geographical coordinates.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
<a name="module_MapModifier.rotateTowardsFrom"></a>
###rotateTowardsFrom(position)
Set the geographical position to rotate the renderables towards.
The child renderables are assumed to be rotated to the right by default.
To change the base rotation, add a rotation-transform to the renderable, like this: 
`new Modifier({transform: Transform.rotateZ(Math.PI/2)})`

**Params**
- position `LatLng` - Geographical position to rotate towards.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
<a name="module_MapModifier.zoomBaseFrom"></a>
###zoomBaseFrom(zoomBase)
Set the base zoom-level. When set, auto-zooming is effectively enabled.
The renderables are then displayed in their true size when the map zoom-level equals zoomBase.

**Params**
- zoomBase `Number` - Map zoom-level

**Scope**: inner function of [MapModifier](#module_MapModifier)  
<a name="module_MapModifier.zoomScaleFrom"></a>
###zoomScaleFrom(zoomScale)
Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and 
decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
a scale-factor, with the following signature: function (zoomBase, zoomCurrent).

**Params**
- zoomScale `Number` | `function` - Zoom-scale factor or function.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
<a name="module_MapModifier.offsetFrom"></a>
###offsetFrom(offset)
Set the displacement offset in geographical coordinates.

**Params**
- offset `LatLng` - Displacement offset in geographical coordinates.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
<a name="module_MapModifier.getPosition"></a>
###getPosition()
Get the current geographical position.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
**Returns**: `LatLng` - Position in geographical coordinates.  
<a name="module_MapModifier.getRotateTowards"></a>
###getRotateTowards()
Get the geographical position towards which the renderables are rotated.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
**Returns**: `LatLng` - Geographical position towards which renderables are rotated.  
<a name="module_MapModifier.getZoomBase"></a>
###getZoomBase()
Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
displayed in their true size.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
**Returns**: `Number` - Base zoom level  
<a name="module_MapModifier.getZoomScale"></a>
###getZoomScale()
Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
a scale-factor.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
**Returns**: `Number` | `function` - Zoom-scale  
<a name="module_MapModifier.getOffset"></a>
###getOffset()
Get the geographical displacement offset.

**Scope**: inner function of [MapModifier](#module_MapModifier)  
**Returns**: `LatLng` - Offset in geographical coordinates.  
