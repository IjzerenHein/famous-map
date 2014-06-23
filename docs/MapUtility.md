MapUtility
==========
class MapUtility
----------------
**Methods**

MapUtility.lat(position)
------------------------
Get the latitude from the position (LatLng) object.



**Parameters**

**position**:  *LatLng*,  Position

**Returns**

*Number*,  Latitude in degrees

MapUtility.lng(position)
------------------------
Get the longitude from the position (LatLng) object.



**Parameters**

**position**:  *LatLng*,  Position

**Returns**

*Number*,  Longitude in degrees

MapUtility.equals(position1, position2)
---------------------------------------
Compares two positions for equality.



**Parameters**

**position1**:  *LatLng*,  Position 1

**position2**:  *LatLng*,  Position 2

**Returns**

*Boolean*,  Result of comparison

MapUtility.radiansFromDegrees(degr)
-----------------------------------
Converts degrees into radians (radians = degrees * (Math.PI / 180)).



**Parameters**

**degr**:  *Number*,  Degrees

**Returns**

*Number*,  radians.

MapUtility.rotationFromPositions(start, end)
--------------------------------------------
Calculates the rotation-angle between two given positions.



**Parameters**

**start**:  *LatLng*,  Start position.

**end**:  *LatLng*,  End position.

**Returns**

*Number*,  Rotation in radians.

MapUtility.distanceBetweenPositions(start, end)
-----------------------------------------------
Calculates the distance between two positions in kilometers.



**Parameters**

**start**:  *LatLng*,  Starting position

**end**:  *LatLng*,  End position

**Returns**

*Number*,  Distance in km

