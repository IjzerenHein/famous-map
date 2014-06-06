class MapItem
-------------
**Methods**

MapItem.setPosition(position, \[transition\], \[callback\])
-----------------------------------------------------------
Adds a position transition to the queue of pending transitions.



**Parameters**

**position**:  *LatLng*,  New position in geographical coordinates (Latitude, Longitude).

**[transition]**:  *Transition*,  Famo.us transitionable object.

**[callback]**:  *Function*,  callback to call after transition completes.

MapItem.rotateTowards(position, \[transition\], \[callback\])
-------------------------------------------------------------
Adds a content-rotation transition to the queue of pending transitions.
The angle of the rotation is determined on the current location and
the specified location.



**Parameters**

**position**:  *LatLng*,  Position in geographical coordinates (Latitude, Longitude).

**[transition]**:  *Transition*,  Famo.us transitionable object.

**[callback]**:  *Function*,  callback to call after transition completes.

MapItem.halt()
--------------
Halts any pending transitions.



MapItem.getPosition()
---------------------
Get the current position.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapItem.getFinalPosition()
--------------------------
Get the destination position.



**Returns**

*LatLng*,  Position in geographical coordinates (Latitude, Longitude)

MapItem.show(renderable, \[transition\], \[callback\])
------------------------------------------------------
Displays the targeted renderable with a transition and an optional callback toexecute afterwards.



**Parameters**

**renderable**:  *Object*,  The renderable you want to show.

**[transition]**:  *Transition*,  Overwrites the default transition in to display the passed-in renderable.

**[callback]**:  *Function*,  Executes after transitioning in the renderable.

MapItem.hide(\[transition\], \[callback\])
------------------------------------------
Hide hides the currently displayed renderable with an out transition.



**Parameters**

**[transition]**:  *Transition*,  Overwrites the default transition in to hide the currently controlled renderable.

**[callback]**:  *Function*,  Executes after transitioning in the renderable.

