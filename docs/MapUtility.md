<a name="module_MapUtility"></a>
##MapUtility

This namespace holds standalone functionality.

  
**Contents**
* [lat(position)](#module_MapUtility.lat)
* [lng(position)](#module_MapUtility.lng)
* [equals(position1, position2)](#module_MapUtility.equals)
* [radiansFromDegrees(degr)](#module_MapUtility.radiansFromDegrees)
* [rotationFromPositions(start, end)](#module_MapUtility.rotationFromPositions)
* [distanceBetweenPositions(start, end)](#module_MapUtility.distanceBetweenPositions)

<a name="module_MapUtility.lat"></a>
###lat(position)
Get the latitude from the position (LatLng) object.

**Params**
- position `LatLng` - Position

**Scope**: inner function of [MapUtility](#module_MapUtility)  
**Returns**: `Number` - Latitude in degrees  
<a name="module_MapUtility.lng"></a>
###lng(position)
Get the longitude from the position (LatLng) object.

**Params**
- position `LatLng` - Position

**Scope**: inner function of [MapUtility](#module_MapUtility)  
**Returns**: `Number` - Longitude in degrees  
<a name="module_MapUtility.equals"></a>
###equals(position1, position2)
Compares two positions for equality.

**Params**
- position1 `LatLng` - Position 1
- position2 `LatLng` - Position 2

**Scope**: inner function of [MapUtility](#module_MapUtility)  
**Returns**: `Boolean` - Result of comparison  
<a name="module_MapUtility.radiansFromDegrees"></a>
###radiansFromDegrees(degr)
Converts degrees into radians (radians = degrees * (Math.PI / 180)).

**Params**
- degr `Number` - Degrees

**Scope**: inner function of [MapUtility](#module_MapUtility)  
**Returns**: `Number` - radians.  
<a name="module_MapUtility.rotationFromPositions"></a>
###rotationFromPositions(start, end)
Calculates the rotation-angle between two given positions.

**Params**
- start `LatLng` - Start position.
- end `LatLng` - End position.

**Scope**: inner function of [MapUtility](#module_MapUtility)  
**Returns**: `Number` - Rotation in radians.  
<a name="module_MapUtility.distanceBetweenPositions"></a>
###distanceBetweenPositions(start, end)
Calculates the distance between two positions in kilometers.

**Params**
- start `LatLng` - Starting position
- end `LatLng` - End position

**Scope**: inner function of [MapUtility](#module_MapUtility)  
**Returns**: `Number` - Distance in km  
