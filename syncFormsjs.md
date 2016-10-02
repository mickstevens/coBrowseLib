# coBrowseLib
#Hows syncForms.js  built ? 
This javascript library which can be used to make any html form co-browsable, is built using Twilio Sync and utilises “Map” as the the data structure to hold information/attributes for each element that is set for co-browsing . It’s generic because once you include this in your page, it would browse the DOM to find all elements which have been set for co-browsing and add them to Sync Map . 
Once done it also subscribes to “itemAdded” and “itemUpdated” events on the data-structure . Detailed discussion on building this library is kept out of this blog , but you can read about it here . 



#Design Flow for syncForms.js  
![alt text](https://github.com/abhijitmehta/coBrowseLib/blob/master/assets/img/Screen%20Shot%202016-09-27%20at%209.20.21%20PM.png " syncForms.js Flow")

#Some more details on Sync 
We  used a specific Sync Data Structure “map” for our use-case. Sync works by allowing you to create different types of synchronization primitives for different purposes. These objects can be created via the REST API or by the relevant SDK. Once opened and subscribed to in a client SDK, Sync objects will be kept synchronized automatically amongst connected clients.
Currently, the three types of object available are:

1. Document: A document is a single JSON object, up to 16kb in size. It is best suited to simple use cases, such as basic publish/subscribe or where history synchronization is not a requirement.
2. List: A list maintains an ordered list of individual JSON objects, each up to 16kb in size. Use this object for more advanced use cases, such as synchronizing location data with the ability to replay old location states. Individual items are accessible through a system generated index.
3. Map: A map maintains an unordered collection of developer specified keys and values. Use this object for synchronization cases where clients are interested in updates to individual keys, such as in presence use cases.

