<a name="module_MapTransition"></a>
##MapTransition

MapTransitions can transition between geographical positions using specific speed (e.g. 50 km/h).

  
**Contents**  
* [reset(state)](#module_MapTransition#reset)
* [set(state, [transition], [callback])](#module_MapTransition#set)
* [get([timestamp])](#module_MapTransition#get)
* [isActive()](#module_MapTransition#isActive)
* [halt()](#module_MapTransition#halt)
* [DEFAULT_OPTIONS](#module_MapTransition.DEFAULT_OPTIONS)

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
- [transition] `Object` - Transition definition
- [callback] `function` - Callback

<a name="module_MapTransition#get"></a>
###mapTransition.get([timestamp])
Get the current position of the transition.

**Params**
- [timestamp] `Date` - Timestamp at which to get the position

**Returns**: `Array.Number` - Array: [lat, lng]  
<a name="module_MapTransition#isActive"></a>
###mapTransition.isActive()
Detects whether a transition is in progress

**Returns**: `Boolean`  
<a name="module_MapTransition#halt"></a>
###mapTransition.halt()
Halt the transition

<a name="module_MapTransition.DEFAULT_OPTIONS"></a>
###MapTransition.DEFAULT_OPTIONS
**Access**: protected  
  
