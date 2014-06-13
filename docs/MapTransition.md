MapTransition
=============
MapTransitions can transition between geographical positions using specific speed (e.g. 50 km/h).


class MapTransition
-------------------
**Methods**

MapTransition.reset(state)
--------------------------
Resets the position



**Parameters**

**state**:  *Array.Number*,  Array: [lat, lng]

MapTransition.set(state, \[transition\], \[callback\])
------------------------------------------------------
Set the end position and transition, with optional callback on completion.



**Parameters**

**state**:  *Array.Number*,  Array: [lat,lng]

**[transition]**:  *Object*,  Transition definition

**[callback]**:  *Function*,  Callback

MapTransition.get(\[timestamp\])
--------------------------------
Get the current position of the transition.



**Parameters**

**[timestamp]**:  *Date*,  Timestamp at which to get the position

**Returns**

*Array.Number*,  Array: [lat, lng]

MapTransition.isActive()
------------------------
Detects whether a transition is in progress



MapTransition.halt()
--------------------
Halt the transition



