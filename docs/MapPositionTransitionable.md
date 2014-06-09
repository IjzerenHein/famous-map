MapPositionTransitionable
=========================
The MapPositionTransitionable makes it possible to transition between two geographical
positions. Currently, only standard transition definitions are supported (see `Transitionable`), but in the future more interesting
transitions may be added.

This class is used internally by `MapView` and `MapStateModifier`.


class MapPositionTransitionable
-------------------------------
**Methods**

MapPositionTransitionable.MapPositionTransitionable(\[position\])
-----------------------------------------------------------------
**Parameters**

**[position]**:  *LatLng*,  Default geopgraphical position

MapPositionTransitionable.setDefaultTransition(transition)
----------------------------------------------------------
Sets the default transition to use for transitioning between position states.



**Parameters**

**transition**:  *Object*,  Transition definition

MapPositionTransitionable.reset(position)
-----------------------------------------
Cancel all transitions and reset to a geographical position.



**Parameters**

**position**:  *LatLng*,  


MapPositionTransitionable.set(position, \[transition\], \[callback\])
---------------------------------------------------------------------
Set the geographical position by adding it to the queue of transition.




**Parameters**

**position**:  *LatLng*,  


**[transition]**:  *Object*,  Transition definition

**[callback]**:  *Function*,  Callback

MapPositionTransitionable.get()
-------------------------------
Get the current geographical position.



MapPositionTransitionable.getFinal()
------------------------------------
Get the destination geographical position.



MapPositionTransitionable.isActive()
------------------------------------
Determine if the transitionable is currently transitioning



MapPositionTransitionable.halt()
--------------------------------
Halts the transition



