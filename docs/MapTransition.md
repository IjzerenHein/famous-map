<a name="module_MapTransition"></a>
##MapTransition

MapTransitions can transition between geographical positions using specific speed (e.g. 50 km/h).

  
**Contents**
* [reset(state)](#module_MapTransition.reset)
* [set(state, [transition], [callback])](#module_MapTransition.set)
* [get([timestamp])](#module_MapTransition.get)
* [isActive()](#module_MapTransition.isActive)
* [halt()](#module_MapTransition.halt)

<a name="module_MapTransition.reset"></a>
###reset(state)
Resets the position

**Params**
- state `Array.Number` - Array: [lat, lng]

**Scope**: inner function of [MapTransition](#module_MapTransition)  
<a name="module_MapTransition.set"></a>
###set(state, [transition], [callback])
Set the end position and transition, with optional callback on completion.

**Params**
- state `Array.Number` - Array: [lat,lng]
- [transition] `Object` - Transition definition
- [callback] `function` - Callback

**Scope**: inner function of [MapTransition](#module_MapTransition)  
<a name="module_MapTransition.get"></a>
###get([timestamp])
Get the current position of the transition.

**Params**
- [timestamp] `Date` - Timestamp at which to get the position

**Scope**: inner function of [MapTransition](#module_MapTransition)  
**Returns**: `Array.Number` - Array: [lat, lng]  
<a name="module_MapTransition.isActive"></a>
###isActive()
Detects whether a transition is in progress

**Scope**: inner function of [MapTransition](#module_MapTransition)  
**Returns**: `Boolean`  
<a name="module_MapTransition.halt"></a>
###halt()
Halt the transition

**Scope**: inner function of [MapTransition](#module_MapTransition)  
