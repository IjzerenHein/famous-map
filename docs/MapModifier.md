<a name="module_MapModifier"></a>
## MapModifier
The MapModifier makes it possible to link renderables to a geopgraphical position on a `MapView`.
Additionally it adds functionality for rotating and zooming renderables, and possibly all kinds of future  map-related transformations.
Use `MapStateModifier` if you want to use transitions, e.g. to animate a move from one geographical position to another.


* [MapModifier](#module_MapModifier)
  * [MapModifier](#exp_module_MapModifier--MapModifier) ⏏
    * [new MapModifier(options)](#new_module_MapModifier--MapModifier_new)
    * [.positionFrom(position)](#module_MapModifier--MapModifier#positionFrom)
    * [.rotateTowardsFrom(position)](#module_MapModifier--MapModifier#rotateTowardsFrom)
    * [.zoomBaseFrom(zoomBase)](#module_MapModifier--MapModifier#zoomBaseFrom)
    * [.zoomScaleFrom(zoomScale)](#module_MapModifier--MapModifier#zoomScaleFrom)
    * [.offsetFrom(offset)](#module_MapModifier--MapModifier#offsetFrom)
    * [.getPosition()](#module_MapModifier--MapModifier#getPosition) ⇒ <code>LatLng</code>
    * [.getRotateTowards()](#module_MapModifier--MapModifier#getRotateTowards) ⇒ <code>LatLng</code>
    * [.getZoomBase()](#module_MapModifier--MapModifier#getZoomBase) ⇒ <code>Number</code>
    * [.getZoomScale()](#module_MapModifier--MapModifier#getZoomScale) ⇒ <code>Number</code> &#124; <code>function</code>
    * [.getOffset()](#module_MapModifier--MapModifier#getOffset) ⇒ <code>LatLng</code>

<a name="exp_module_MapModifier--MapModifier"></a>
### MapModifier ⏏
**Kind**: Exported class  
<a name="new_module_MapModifier--MapModifier_new"></a>
#### new MapModifier(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options. |
| options.mapView | <code>MapView</code> | The MapView. |
| [options.position] | <code>LatLng</code> | Initial geographical coordinates. |
| [options.offset] | <code>LatLng</code> | Displacement offset in geographical coordinates from the position. |
| [options.rotateTowards] | <code>LatLng</code> &#124; <code>object</code> &#124; <code>function</code> | Position to rotate the renderables towards. |
| [options.zoomBase] | <code>number</code> | Base zoom-level at which the renderables are displayed in their true size. |
| [options.zoomScale] | <code>number</code> &#124; <code>function</code> | Customer zoom-scaling factor or function. |

<a name="module_MapModifier--MapModifier#positionFrom"></a>
#### mapModifier.positionFrom(position)
Set the geographical position of the renderables.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> &#124; <code>function</code> &#124; <code>Object</code> | Position in geographical coordinates. |

<a name="module_MapModifier--MapModifier#rotateTowardsFrom"></a>
#### mapModifier.rotateTowardsFrom(position)
Set the geographical position to rotate the renderables towards.
The child renderables are assumed to be rotated to the right by default.
To change the base rotation, add a rotation-transform to the renderable, like this:
`new Modifier({transform: Transform.rotateZ(Math.PI/2)})`

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> | Geographical position to rotate towards. |

<a name="module_MapModifier--MapModifier#zoomBaseFrom"></a>
#### mapModifier.zoomBaseFrom(zoomBase)
Set the base zoom-level. When set, auto-zooming is effectively enabled.
The renderables are then displayed in their true size when the map zoom-level equals zoomBase.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| zoomBase | <code>Number</code> | Map zoom-level |

<a name="module_MapModifier--MapModifier#zoomScaleFrom"></a>
#### mapModifier.zoomScaleFrom(zoomScale)
Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and
decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
a scale-factor, with the following signature: function (zoomBase, zoomCurrent).

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| zoomScale | <code>Number</code> &#124; <code>function</code> | Zoom-scale factor or function. |

<a name="module_MapModifier--MapModifier#offsetFrom"></a>
#### mapModifier.offsetFrom(offset)
Set the displacement offset in geographical coordinates.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>LatLng</code> | Displacement offset in geographical coordinates. |

<a name="module_MapModifier--MapModifier#getPosition"></a>
#### mapModifier.getPosition() ⇒ <code>LatLng</code>
Get the current geographical position.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  
**Returns**: <code>LatLng</code> - Position in geographical coordinates.  
<a name="module_MapModifier--MapModifier#getRotateTowards"></a>
#### mapModifier.getRotateTowards() ⇒ <code>LatLng</code>
Get the geographical position towards which the renderables are rotated.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  
**Returns**: <code>LatLng</code> - Geographical position towards which renderables are rotated.  
<a name="module_MapModifier--MapModifier#getZoomBase"></a>
#### mapModifier.getZoomBase() ⇒ <code>Number</code>
Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
displayed in their true size.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  
**Returns**: <code>Number</code> - Base zoom level  
<a name="module_MapModifier--MapModifier#getZoomScale"></a>
#### mapModifier.getZoomScale() ⇒ <code>Number</code> &#124; <code>function</code>
Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
a scale-factor.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  
**Returns**: <code>Number</code> &#124; <code>function</code> - Zoom-scale  
<a name="module_MapModifier--MapModifier#getOffset"></a>
#### mapModifier.getOffset() ⇒ <code>LatLng</code>
Get the geographical displacement offset.

**Kind**: instance method of <code>[MapModifier](#exp_module_MapModifier--MapModifier)</code>  
**Returns**: <code>LatLng</code> - Offset in geographical coordinates.  
