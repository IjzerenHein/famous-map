<a name="module_MapUtility"></a>
#MapUtility
This namespace holds standalone functionality.

<a name="exp_module_MapUtility"></a>
##class: MapUtility ⏏
**Members**

* [class: MapUtility ⏏](#exp_module_MapUtility)
  * [MapUtility.lat(position)](#module_MapUtility.lat)
  * [MapUtility.lng(position)](#module_MapUtility.lng)
  * [MapUtility.equals(position1, position2)](#module_MapUtility.equals)
  * [MapUtility.radiansFromDegrees(deg)](#module_MapUtility.radiansFromDegrees)
  * [MapUtility.rotationFromPositions(start, end)](#module_MapUtility.rotationFromPositions)
  * [MapUtility.distanceBetweenPositions(start, end)](#module_MapUtility.distanceBetweenPositions)

<a name="module_MapUtility.lat"></a>
###MapUtility.lat(position)
Get the latitude from the position (LatLng) object.

**Params**

- position `LatLng` - Position  

**Returns**: `Number` - Latitude in degrees  
<a name="module_MapUtility.lng"></a>
###MapUtility.lng(position)
Get the longitude from the position (LatLng) object.

**Params**

- position `LatLng` - Position  

**Returns**: `Number` - Longitude in degrees  
<a name="module_MapUtility.equals"></a>
###MapUtility.equals(position1, position2)
Compares two positions for equality.

**Params**

- position1 `LatLng` - Position 1  
- position2 `LatLng` - Position 2  

**Returns**: `Boolean` - Result of comparison  
<a name="module_MapUtility.radiansFromDegrees"></a>
###MapUtility.radiansFromDegrees(deg)
Converts degrees into radians (radians = degrees * (Math.PI / 180)).

**Params**

- deg `Number` - Degrees  

**Returns**: `Number` - radians.  
<a name="module_MapUtility.rotationFromPositions"></a>
###MapUtility.rotationFromPositions(start, end)
Calculates the rotation-angle between two given positions.

**Params**

- start `LatLng` - Start position.  
- end `LatLng` - End position.  

**Returns**: `Number` - Rotation in radians.  
<a name="module_MapUtility.distanceBetweenPositions"></a>
###MapUtility.distanceBetweenPositions(start, end)
Calculates the distance between two positions in kilometers.

**Params**

- start `LatLng` - Starting position  
- end `LatLng` - End position  

**Returns**: `Number` - Distance in km  
