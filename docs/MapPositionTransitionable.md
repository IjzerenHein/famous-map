<a name="module_MapPositionTransitionable"></a>
## MapPositionTransitionable
The MapPositionTransitionable makes it possible to transition between two geographical
positions. Currently, only standard transition definitions are supported (see `Transitionable`), but in the future more interesting
transitions may be added.

*This class is used internally by `MapView` and `MapStateModifier`.*


* [MapPositionTransitionable](#module_MapPositionTransitionable)
  * [MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable) ⏏
    * [new MapPositionTransitionable([position])](#new_module_MapPositionTransitionable--MapPositionTransitionable_new)
    * [.setDefaultTransition(transition)](#module_MapPositionTransitionable--MapPositionTransitionable#setDefaultTransition)
    * [.reset(position)](#module_MapPositionTransitionable--MapPositionTransitionable#reset)
    * [.set(position, [transition], [callback])](#module_MapPositionTransitionable--MapPositionTransitionable#set)
    * [.get()](#module_MapPositionTransitionable--MapPositionTransitionable#get) ⇒ <code>LatLng</code>
    * [.getFinal()](#module_MapPositionTransitionable--MapPositionTransitionable#getFinal) ⇒ <code>LatLng</code>
    * [.isActive()](#module_MapPositionTransitionable--MapPositionTransitionable#isActive) ⇒ <code>Boolean</code>
    * [.halt()](#module_MapPositionTransitionable--MapPositionTransitionable#halt)

<a name="exp_module_MapPositionTransitionable--MapPositionTransitionable"></a>
### MapPositionTransitionable ⏏
**Kind**: Exported class  
<a name="new_module_MapPositionTransitionable--MapPositionTransitionable_new"></a>
#### new MapPositionTransitionable([position])

| Param | Type | Description |
| --- | --- | --- |
| [position] | <code>LatLng</code> | Default geopgraphical position |

<a name="module_MapPositionTransitionable--MapPositionTransitionable#setDefaultTransition"></a>
#### mapPositionTransitionable.setDefaultTransition(transition)
Sets the default transition to use for transitioning between position states.

**Kind**: instance method of <code>[MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| transition | <code>Object</code> | Transition definition |

<a name="module_MapPositionTransitionable--MapPositionTransitionable#reset"></a>
#### mapPositionTransitionable.reset(position)
Cancel all transitions and reset to a geographical position.

**Kind**: instance method of <code>[MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable)</code>  

| Param | Type |
| --- | --- |
| position | <code>LatLng</code> | 

<a name="module_MapPositionTransitionable--MapPositionTransitionable#set"></a>
#### mapPositionTransitionable.set(position, [transition], [callback])
Set the geographical position by adding it to the queue of transition.

**Kind**: instance method of <code>[MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> |  |
| [transition] | <code>Object</code> | Transition definition |
| [callback] | <code>function</code> | Callback |

<a name="module_MapPositionTransitionable--MapPositionTransitionable#get"></a>
#### mapPositionTransitionable.get() ⇒ <code>LatLng</code>
Get the current geographical position.

**Kind**: instance method of <code>[MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable)</code>  
<a name="module_MapPositionTransitionable--MapPositionTransitionable#getFinal"></a>
#### mapPositionTransitionable.getFinal() ⇒ <code>LatLng</code>
Get the destination geographical position.

**Kind**: instance method of <code>[MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable)</code>  
<a name="module_MapPositionTransitionable--MapPositionTransitionable#isActive"></a>
#### mapPositionTransitionable.isActive() ⇒ <code>Boolean</code>
Determine if the transitionable is currently transitioning

**Kind**: instance method of <code>[MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable)</code>  
<a name="module_MapPositionTransitionable--MapPositionTransitionable#halt"></a>
#### mapPositionTransitionable.halt()
Halts the transition

**Kind**: instance method of <code>[MapPositionTransitionable](#exp_module_MapPositionTransitionable--MapPositionTransitionable)</code>  
