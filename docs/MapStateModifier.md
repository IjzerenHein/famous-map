<a name="module_MapStateModifier"></a>
## MapStateModifier
The MapStateModifier makes it possible to use transitions to e.g. move a renderable from one geographical
position to another. If the renderable doesn't require transitions, the use of the lightweight
and stateless `MapModifier` is strongly preferred.


* [MapStateModifier](#module_MapStateModifier)
  * [MapStateModifier](#exp_module_MapStateModifier--MapStateModifier) ⏏
    * [new MapStateModifier(options)](#new_module_MapStateModifier--MapStateModifier_new)
    * [.setPosition(position, [transition], [callback])](#module_MapStateModifier--MapStateModifier#setPosition)
    * [.rotateTowards(position, [transition], [callback])](#module_MapStateModifier--MapStateModifier#rotateTowards)
    * [.setZoomBase(zoomBase)](#module_MapStateModifier--MapStateModifier#setZoomBase)
    * [.setZoomScale(zoomScale)](#module_MapStateModifier--MapStateModifier#setZoomScale)
    * [.setOffset(offset)](#module_MapStateModifier--MapStateModifier#setOffset)
    * [.getPosition()](#module_MapStateModifier--MapStateModifier#getPosition) ⇒ <code>LatLng</code>
    * [.getRotateTowards()](#module_MapStateModifier--MapStateModifier#getRotateTowards) ⇒ <code>LatLng</code>
    * [.getFinalPosition()](#module_MapStateModifier--MapStateModifier#getFinalPosition) ⇒ <code>LatLng</code>
    * [.getFinalRotateTowards()](#module_MapStateModifier--MapStateModifier#getFinalRotateTowards) ⇒ <code>LatLng</code>
    * [.getZoomBase()](#module_MapStateModifier--MapStateModifier#getZoomBase) ⇒ <code>Number</code>
    * [.getZoomScale()](#module_MapStateModifier--MapStateModifier#getZoomScale) ⇒ <code>Number</code> &#124; <code>function</code>
    * [.getOffset()](#module_MapStateModifier--MapStateModifier#getOffset) ⇒ <code>LatLng</code>
    * [.halt()](#module_MapStateModifier--MapStateModifier#halt)
    * [.isActive()](#module_MapStateModifier--MapStateModifier#isActive) ⇒ <code>Bool</code>

<a name="exp_module_MapStateModifier--MapStateModifier"></a>
### MapStateModifier ⏏
**Kind**: Exported class  
<a name="new_module_MapStateModifier--MapStateModifier_new"></a>
#### new MapStateModifier(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options. |
| options.mapView | <code>MapView</code> | The MapView. |
| [options.position] | <code>LatLng</code> | Initial geographical coordinates. |
| [options.offset] | <code>LatLng</code> | Displacement offset in geographical coordinates from the position. |
| [options.rotateTowards] | <code>LatLng</code> | Position to rotate the renderables towards. |
| [options.zoomBase] | <code>number</code> | Base zoom-level at which the renderables are displayed in their true size. |
| [options.zoomScale] | <code>number</code> &#124; <code>function</code> | Custom zoom-scaling factor or function. |

<a name="module_MapStateModifier--MapStateModifier#setPosition"></a>
#### mapStateModifier.setPosition(position, [transition], [callback])
Set the geographical position of the renderables, by adding the new position to the chain of transitions.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> | New position in geographical coordinates (Latitude, Longitude). |
| [transition] | <code>Transition</code> | Famo.us transitionable object. |
| [callback] | <code>function</code> | callback to call after transition completes. |

<a name="module_MapStateModifier--MapStateModifier#rotateTowards"></a>
#### mapStateModifier.rotateTowards(position, [transition], [callback])
Set the destination geographical position to rotate the renderables towards, by adding them.
to the chain of transitions.
The child renderables are assumed to be rotated to the right by default.
To change the base rotation, add a rotation-transform to the renderable, like this:
`new Modifier({transform: Transform.rotateZ(Math.PI/2)})`

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> | Destination position in geographical position to rotate towards. |
| [transition] | <code>Transition</code> | Famo.us transitionable object. |
| [callback] | <code>function</code> | callback to call after transition completes. |

<a name="module_MapStateModifier--MapStateModifier#setZoomBase"></a>
#### mapStateModifier.setZoomBase(zoomBase)
Set the base zoom-level. When set, auto-zooming is effectively enabled.
The renderables are then displayed in their true size when the map zoom-level equals zoomBase.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| zoomBase | <code>Number</code> | Map zoom-level |

<a name="module_MapStateModifier--MapStateModifier#setZoomScale"></a>
#### mapStateModifier.setZoomScale(zoomScale)
Set the zoom-scale (ignored when zoomBase is not set). When set, the scale is increased when zooming in and
decreased when zooming-out. The zoomScale can be either a Number or a Function which returns
a scale-factor, with the following signature: function (zoomBase, zoomCurrent).

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| zoomScale | <code>Number</code> &#124; <code>function</code> | Zoom-scale factor or function. |

<a name="module_MapStateModifier--MapStateModifier#setOffset"></a>
#### mapStateModifier.setOffset(offset)
Set the displacement offset in geographical coordinates.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>LatLng</code> | Displacement offset in geographical coordinates. |

<a name="module_MapStateModifier--MapStateModifier#getPosition"></a>
#### mapStateModifier.getPosition() ⇒ <code>LatLng</code>
Get the current geographical position.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>LatLng</code> - Position in geographical coordinates.  
<a name="module_MapStateModifier--MapStateModifier#getRotateTowards"></a>
#### mapStateModifier.getRotateTowards() ⇒ <code>LatLng</code>
Get the geographical position towards which the renderables are currently rotated.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>LatLng</code> - Destination geographical position towards which renderables are rotated.  
<a name="module_MapStateModifier--MapStateModifier#getFinalPosition"></a>
#### mapStateModifier.getFinalPosition() ⇒ <code>LatLng</code>
Get the destination geographical position.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>LatLng</code> - Position in geographical coordinates.  
<a name="module_MapStateModifier--MapStateModifier#getFinalRotateTowards"></a>
#### mapStateModifier.getFinalRotateTowards() ⇒ <code>LatLng</code>
Get the destination geographical position which the renderables should be rotated towards.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>LatLng</code> - Position in geographical coordinates.  
<a name="module_MapStateModifier--MapStateModifier#getZoomBase"></a>
#### mapStateModifier.getZoomBase() ⇒ <code>Number</code>
Get the base zoom-level. The zoomBase indicates the zoom-level at which renderables are
displayed in their true size.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>Number</code> - Base zoom level  
<a name="module_MapStateModifier--MapStateModifier#getZoomScale"></a>
#### mapStateModifier.getZoomScale() ⇒ <code>Number</code> &#124; <code>function</code>
Get the base zoom-scale. The zoomScale can be either a Number or a Function which returns
a scale-factor.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>Number</code> &#124; <code>function</code> - Zoom-scale  
<a name="module_MapStateModifier--MapStateModifier#getOffset"></a>
#### mapStateModifier.getOffset() ⇒ <code>LatLng</code>
Get the geographical displacement offset.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>LatLng</code> - Offset in geographical coordinates.  
<a name="module_MapStateModifier--MapStateModifier#halt"></a>
#### mapStateModifier.halt()
Halts any pending transitions.

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
<a name="module_MapStateModifier--MapStateModifier#isActive"></a>
#### mapStateModifier.isActive() ⇒ <code>Bool</code>
Is there at least one transition pending completion?

**Kind**: instance method of <code>[MapStateModifier](#exp_module_MapStateModifier--MapStateModifier)</code>  
**Returns**: <code>Bool</code> - True when there are active transitions running.  
