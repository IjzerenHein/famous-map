<a name="module_MapUtility"></a>
## MapUtility
This namespace holds standalone functionality.


* [MapUtility](#module_MapUtility)
  * [MapUtility](#exp_module_MapUtility--MapUtility) ⏏
    * [.lat(position)](#module_MapUtility--MapUtility.lat) ⇒ <code>Number</code>
    * [.lng(position)](#module_MapUtility--MapUtility.lng) ⇒ <code>Number</code>
    * [.equals(position1, position2)](#module_MapUtility--MapUtility.equals) ⇒ <code>Boolean</code>
    * [.radiansFromDegrees(deg)](#module_MapUtility--MapUtility.radiansFromDegrees) ⇒ <code>Number</code>
    * [.rotationFromPositions(start, end)](#module_MapUtility--MapUtility.rotationFromPositions) ⇒ <code>Number</code>
    * [.distanceBetweenPositions(start, end)](#module_MapUtility--MapUtility.distanceBetweenPositions) ⇒ <code>Number</code>

<a name="exp_module_MapUtility--MapUtility"></a>
### MapUtility ⏏
**Kind**: Exported class  
<a name="module_MapUtility--MapUtility.lat"></a>
#### MapUtility.lat(position) ⇒ <code>Number</code>
Get the latitude from the position (LatLng) object.

**Kind**: static method of <code>[MapUtility](#exp_module_MapUtility--MapUtility)</code>  
**Returns**: <code>Number</code> - Latitude in degrees  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> | Position |

<a name="module_MapUtility--MapUtility.lng"></a>
#### MapUtility.lng(position) ⇒ <code>Number</code>
Get the longitude from the position (LatLng) object.

**Kind**: static method of <code>[MapUtility](#exp_module_MapUtility--MapUtility)</code>  
**Returns**: <code>Number</code> - Longitude in degrees  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>LatLng</code> | Position |

<a name="module_MapUtility--MapUtility.equals"></a>
#### MapUtility.equals(position1, position2) ⇒ <code>Boolean</code>
Compares two positions for equality.

**Kind**: static method of <code>[MapUtility](#exp_module_MapUtility--MapUtility)</code>  
**Returns**: <code>Boolean</code> - Result of comparison  

| Param | Type | Description |
| --- | --- | --- |
| position1 | <code>LatLng</code> | Position 1 |
| position2 | <code>LatLng</code> | Position 2 |

<a name="module_MapUtility--MapUtility.radiansFromDegrees"></a>
#### MapUtility.radiansFromDegrees(deg) ⇒ <code>Number</code>
Converts degrees into radians (radians = degrees * (Math.PI / 180)).

**Kind**: static method of <code>[MapUtility](#exp_module_MapUtility--MapUtility)</code>  
**Returns**: <code>Number</code> - radians.  

| Param | Type | Description |
| --- | --- | --- |
| deg | <code>Number</code> | Degrees |

<a name="module_MapUtility--MapUtility.rotationFromPositions"></a>
#### MapUtility.rotationFromPositions(start, end) ⇒ <code>Number</code>
Calculates the rotation-angle between two given positions.

**Kind**: static method of <code>[MapUtility](#exp_module_MapUtility--MapUtility)</code>  
**Returns**: <code>Number</code> - Rotation in radians.  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>LatLng</code> | Start position. |
| end | <code>LatLng</code> | End position. |

<a name="module_MapUtility--MapUtility.distanceBetweenPositions"></a>
#### MapUtility.distanceBetweenPositions(start, end) ⇒ <code>Number</code>
Calculates the distance between two positions in kilometers.

**Kind**: static method of <code>[MapUtility](#exp_module_MapUtility--MapUtility)</code>  
**Returns**: <code>Number</code> - Distance in km  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>LatLng</code> | Starting position |
| end | <code>LatLng</code> | End position |

