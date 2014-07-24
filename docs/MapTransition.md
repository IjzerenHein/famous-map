<a name="module_MapTransition"></a>
#MapTransition
MapTransitions can transition between geographical positions using specific speed (e.g. 50 km/h).

<a name="exp_module_MapTransition"></a>
##class: MapTransition ⏏
**Members**

* [class: MapTransition ⏏](#exp_module_MapTransition)
  * [MapTransition.DEFAULT_OPTIONS](#module_MapTransition.DEFAULT_OPTIONS)
    * [DEFAULT_OPTIONS.speed](#module_MapTransition.DEFAULT_OPTIONS.speed)
  * [mapTransition.reset(state)](#module_MapTransition#reset)
  * [mapTransition.set(state, [transition], [callback])](#module_MapTransition#set)
  * [mapTransition.get([timestamp])](#module_MapTransition#get)
  * [mapTransition.isActive()](#module_MapTransition#isActive)
  * [mapTransition.halt()](#module_MapTransition#halt)

<a name="module_MapTransition.DEFAULT_OPTIONS"></a>
###MapTransition.DEFAULT_OPTIONS
**Access**: protected  
<a name="module_MapTransition#reset"></a>
###mapTransition.reset(state)
Resets the position

**Params**

- state `Array.Number` - Array: [lat, lng]  

<a name="module_MapTransition#set"></a>
###mapTransition.set(state, [transition], [callback])
Set the end position and transition, with optional callback on completion.

**Params**

- state `Array.Number` - Array: [lat,lng]  
- \[transition\] `Object` - Transition definition  
- \[callback\] `function` - Callback  

<a name="module_MapTransition#get"></a>
###mapTransition.get([timestamp])
Get the current position of the transition.

**Params**

- \[timestamp\] `Date` - Timestamp at which to get the position  

**Returns**: `Array.Number` - Array: [lat, lng]  
<a name="module_MapTransition#isActive"></a>
###mapTransition.isActive()
Detects whether a transition is in progress

**Returns**: `Boolean`  
<a name="module_MapTransition#halt"></a>
###mapTransition.halt()
Halt the transition

