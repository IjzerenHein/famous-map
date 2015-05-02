<a name="module_MapTransition"></a>
## MapTransition
MapTransitions can transition between geographical positions using specific speed (e.g. 50 km/h).


* [MapTransition](#module_MapTransition)
  * [MapTransition](#exp_module_MapTransition--MapTransition) ⏏
    * _instance_
      * [.reset(state)](#module_MapTransition--MapTransition#reset)
      * [.set(state, [transition], [callback])](#module_MapTransition--MapTransition#set)
      * [.get([timestamp])](#module_MapTransition--MapTransition#get) ⇒ <code>Array.Number</code>
      * [.isActive()](#module_MapTransition--MapTransition#isActive) ⇒ <code>Boolean</code>
      * [.halt()](#module_MapTransition--MapTransition#halt)
    * _static_
      * [.DEFAULT_OPTIONS](#module_MapTransition--MapTransition.DEFAULT_OPTIONS)
        * [.speed](#module_MapTransition--MapTransition.DEFAULT_OPTIONS.speed)

<a name="exp_module_MapTransition--MapTransition"></a>
### MapTransition ⏏
**Kind**: Exported class  
<a name="module_MapTransition--MapTransition#reset"></a>
#### mapTransition.reset(state)
Resets the position

**Kind**: instance method of <code>[MapTransition](#exp_module_MapTransition--MapTransition)</code>  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Array.Number</code> | Array: [lat, lng] |

<a name="module_MapTransition--MapTransition#set"></a>
#### mapTransition.set(state, [transition], [callback])
Set the end position and transition, with optional callback on completion.

**Kind**: instance method of <code>[MapTransition](#exp_module_MapTransition--MapTransition)</code>  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Array.Number</code> | Array: [lat,lng] |
| [transition] | <code>Object</code> | Transition definition |
| [callback] | <code>function</code> | Callback |

<a name="module_MapTransition--MapTransition#get"></a>
#### mapTransition.get([timestamp]) ⇒ <code>Array.Number</code>
Get the current position of the transition.

**Kind**: instance method of <code>[MapTransition](#exp_module_MapTransition--MapTransition)</code>  
**Returns**: <code>Array.Number</code> - Array: [lat, lng]  

| Param | Type | Description |
| --- | --- | --- |
| [timestamp] | <code>Date</code> | Timestamp at which to get the position |

<a name="module_MapTransition--MapTransition#isActive"></a>
#### mapTransition.isActive() ⇒ <code>Boolean</code>
Detects whether a transition is in progress

**Kind**: instance method of <code>[MapTransition](#exp_module_MapTransition--MapTransition)</code>  
<a name="module_MapTransition--MapTransition#halt"></a>
#### mapTransition.halt()
Halt the transition

**Kind**: instance method of <code>[MapTransition](#exp_module_MapTransition--MapTransition)</code>  
<a name="module_MapTransition--MapTransition.DEFAULT_OPTIONS"></a>
#### MapTransition.DEFAULT_OPTIONS
**Kind**: static property of <code>[MapTransition](#exp_module_MapTransition--MapTransition)</code>  
**Access:** protected  
**Properties**

| Name |
| --- |
| DEFAULT_OPTIONS | 

<a name="module_MapTransition--MapTransition.DEFAULT_OPTIONS.speed"></a>
##### DEFAULT_OPTIONS.speed
The speed of the transition in mph.

**Kind**: static property of <code>[DEFAULT_OPTIONS](#module_MapTransition--MapTransition.DEFAULT_OPTIONS)</code>  
