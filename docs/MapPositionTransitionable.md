class MapPositionTransitionable
-------------------------------
**Methods**

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


MapPositionTransitionable.set(position, \[transition\[, \[callback\])
---------------------------------------------------------------------
Set the geographical position by adding it to the queue of transition.




**Parameters**

**position**:  *LatLng*,  


**[transition[**:  *Object*,  Transition definition

**[callback]**:  *Function*,  Callback

MapPositionTransitionable.get()
-------------------------------
Get the current geographical position.



MapPositionTransitionable.getFinal()
------------------------------------
Get the destination geographical position.



MapPositionTransitionable.isActive()
------------------------------------
Determine if the MapPositionTransitionable is currently transitioning



MapPositionTransitionable.halt()
--------------------------------
Halts the transition



