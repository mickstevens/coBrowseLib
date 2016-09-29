# coBrowseLib
#Hows syncForms.js  built ? 
This javascript library which can be used to make any html form co-browsable, is built using Twilio Sync and utilises “Map” as the the data structure to hold information/attributes for each element that is set for co-browsing . It’s generic because once you include this in your page, it would browse the DOM to find all elements which have been set for co-browsing and add them to Sync Map . 
Once done it also subscribes to “itemAdded” and “itemUpdated” events on the data-structure . Detailed discussion on building this library is kept out of this blog , but you can read about it here . 



#Design Flow for syncForms.js  
![alt text](https://github.com/abhijitmehta/coBrowseLib/blob/master/assets/img/Screen%20Shot%202016-09-27%20at%209.20.21%20PM.png " syncForms.js Flow")

