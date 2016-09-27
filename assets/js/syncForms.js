

/* Global Variables */
var syncClient = null;
var formMapName = "";
var formMap = null;
var accessManager = null;
var endpointId = null;
var timeStamp = (new  Date()).getTime();
var cbEndPointsList;
var startSyncFlag = 0;


/*
                        _____________________ Cobrowser1 (cobrowserId)
                       |
                       |________________________________Cobrowser2 (cobrowserId)
                       |
                       |
                       |_________________Cobrowser3 (cobrowserId)
      sessionKey ------+
                       |
                       |_________________________________________Cobrowser4 (cobrowserId)
                       |
                       |
                       |___________________ Cobrowser5 (cobrowserId)
*/



/* Function Name  : getTokenAndSetupCoBrowsing
   Input          : (1) cobrowserId  - Any random identity to be used as name for this endpoint
   Description    : This endpoint needs to be authenticated . Get AccessToken from the Server that would vouch for this endpoint
*/

function getTokenAndSetupCoBrowsing(cobrowserId)
  {
    return new Promise(function(resolve, reject)
    {

      endpointId = cobrowserId+makeid(11)+'_'+timeStamp;

      /*Get the token .  This endpoint has been set up as a server app , which you need to setup . The server would interact with Twilio and pass Token to this endpoint . This model ensures there are no identificatin informatin exposed
        at client side . For a sample server app , have a look at https://github.com/abhijitmehta/coBrowseLib .*/
      $.get('/getToken?identity=' + cobrowserId + '&endpointId=' + endpointId, function( data )
               {
                     resolve(data);
                }
          );

    });
  }



  /* Function Name  : startCobrowsing
     Input          : (1) cobrowserId  - Any random identity to be used as name for this endpoint
                      (2) sessionKey   - Name for this cobrowsing session. This is the name that each endpoints would use to share there information . See above diagram to understand the role and positioning of
                                        cobrowserId  and sessionKey
     Description    : Initialise Cobrowsing  by performing following actions
                      (A) Initiate a client to Twilio Sync
                      (B) Register this endpoint(browser) to Twilio Sync and provide global information for this browser .
  */

function startCobrowsing(cobrowserId,sessionKey)
  {

      getTokenAndSetupCoBrowsing(cobrowserId,sessionKey)
      .then(
              function(token)
                    {
                          console.log("TOKEN::",token);

                          formMapName = 'cobrowsingAt'+sessionKey;
                          cbEndPointsList = new Array();

                          /* Create a Twilio Sync client to access its data structures - map and list to be used fo syncing endpoints */
                          accessManager = new Twilio.AccessManager(token.token);
                          syncClient = new Twilio.Sync.Client(accessManager);
                          cbEndPointsList.push(endpointId);


                          var formGlobalFieldName = "formGlobalAttributes" ;
                          var formGlobalFieldAttrText = '{'
                            + ' "sessionId": "' + sessionKey + ' ",'
                            + ' "syncedDS": "' + formMapName + ' ",'
                            + ' "thisEndPoint": "' + endpointId + ' ",'
                            + ' "cbEndPoints": "' + cbEndPointsList + ' "'
                            + '}';


                          var   formGlobalFieldAttr = JSON.parse(formGlobalFieldAttrText);


                          var l_formFieldAppendAttribList = new Array();
                          var l_formFieldAppendAttribValueList = new Array();
                          l_formFieldAppendAttribList.push("cbEndPoints");
                          l_formFieldAppendAttribValueList.push(endpointId);

                          syncThisFormElement(formMapName,formGlobalFieldName,formGlobalFieldAttr,l_formFieldAppendAttribList,l_formFieldAppendAttribValueList,TwilioSyncToForm);


                    }
                );


  }


  /* Function Name  : syncThisFormElement
     Input          :
     Description    :
  */

function syncThisFormElement (formMapName,formFieldName,formFieldAttributes,formFieldAppendAttribList,formFieldAppendAttribValueList,onUpdateAction)
{


        if ( formFieldAppendAttribList.length  != formFieldAppendAttribValueList.length )
           {
               throw "INVALID_APPEND_LIST - LENGTH OF LIST CONTAINING KEYS DIFFERS FROM THAT CONTAINING VALUES "

           }
        /*Create an apt data structure to store all form fields - I am going to use map for the entire form .
          Key : form-field , values : attributes related to the field including the value in the field and upading endpoint details */



          /* Create map now for the form shared across various endpoints sharing the same sessionKey*/
          gotFormMap = syncClient.map(formMapName).then(function(map)
                                               {


                                                    formMap = map;


                                                    if ( formFieldAppendAttribList.length > 0 )
                                                    {
                                                      formMap.mutate(formFieldName, function (remoteValue)
                                                                      {
                                                                            console.log("mutate :: ", remoteValue);
                                                                            var remoteValueParsed = JSON.stringify(remoteValue, null, 4) ;

                                                                            if ( remoteValueParsed != "{}")
                                                                            {

                                                                              var appendListLength = formFieldAppendAttribList.length ;

                                                                              var i = 0;
                                                                              for ( i = 0 ; i<appendListLength;i++)
                                                                                  {
                                                                                    if (remoteValue[formFieldAppendAttribList[i]])
                                                                                    {
                                                                                      var endPointListArrayFromServer = remoteValue[formFieldAppendAttribList[i]].toString().split(',');
                                                                                      formFieldAttributes[formFieldAppendAttribList[i]] = endPointListArrayFromServer;
                                                                                      formFieldAttributes[formFieldAppendAttribList[i]].push(formFieldAppendAttribValueList[i])
                                                                                    }

                                                                                  }
                                                                                remoteValue = formFieldAttributes;
                                                                                return remoteValue ;
                                                                              }
                                                                             else
                                                                              {
                                                                                  formMap.set(formFieldName,formFieldAttributes
                                                                                                           ).then(function(item)
                                                                                                                {
                                                                                                                    console.log('Added to the map , item id : ', item.value);
                                                                                                                }
                                                                                                            ).catch(function(err)
                                                                                                                   {
                                                                                                                     console.error(err)
                                                                                                                   }
                                                                                                                  )
                                                                              }

                                                                        }
                                                                     )
                                                                     .then(function ()
                                                                              {

                                                                                  console.log("mutate_done : " +  formMap);
                                                                              }
                                                                            );
                                                    }
                                                    else
                                                    {
                                                      formMap.set(formFieldName,formFieldAttributes
                                                                               ).then(function(item)
                                                                                    {
                                                                                        console.log('Added to the map , item id : ', item.value);
                                                                                    }
                                                                                ).catch(function(err)
                                                                                       {
                                                                                         console.error(err)
                                                                                       }
                                                                                      )
                                                    }



                                                    formMap.on("itemUpdated" , onUpdateAction );
                                                    if(startSyncFlag === 0) initFormAndTwilioSync();

                                                });



}







/* Function Name  : initFormAndTwilioSync
   Input          :
   Description    :
*/
function initFormAndTwilioSync()
{
  startSyncFlag = 1;

  var validFormElemArr = $('[data-coBrowsable="true"]') ;


  var validFormElemSerializedArr = $('[data-coBrowsable="true"]').serializeArray() ;
  $.each(validFormElemSerializedArr , function ( elemIdx , validFormElement)
                                      {
                                           var elementName = validFormElement.name ;
                                           var elementValue = validFormElement.value;
                                           var thisElement = $('[name="'+ elementName +'"]')[0];
                                           var elementType = thisElement.type;
                                           var elementTag = thisElement.tagName ;
                                           var elementId = thisElement.id;


                                           thisElement.onload = function() {  elemInitValue(elementId)} ;
                                           //thisElement.onkeyup = function() { formToTwilioSync(elementType , elementId ,elementName , elementValue)}   ;
                                           //thisElement.onmouseup = function() { formToTwilioSync(elementType , elementId ,elementName , elementValue)}   ;
                                           //thisElement.onchange = function() { formToTwilioSync(elementType , elementId ,elementName , elementValue)}   ;
                                           $('[name="'+ elementName +'"]').on('change',function() { formToTwilioSync(elementType , elementId ,elementName , elementValue)}   ) ;
                                           $('[name="'+ elementName +'"]').on('keyup',function() { formToTwilioSync(elementType , elementId ,elementName , elementValue)}   ) ;

                                           //thisElement.oninput = function() { formToTwilioSync(elementType , elementId ,elementName , elementValue)}   ;

                                           elemInitValue(elementId)
                                           //thisElement.onchange = function() { formToTwilioSync(elementType , elementId ,elementName , elementValue )}   ;


                                      }
                                    );


}






/* Function Name  : TwilioSyncToForm
   Input          :
   Description    :
*/
function TwilioSyncToForm(item)
{

  console.log("in TwilioSyncToForm : Detected change in map");
  var elementModifield = item.key;
  var elementModifier = item.value.from;
  var elementType = item.value.elementType ;
  var elementName = item.value.elementName ;
  var elementValue = item.value.value ;

  if ( elementModifier != endpointId )
    {

        $('[name="'+elementName+'"]').val([elementValue]);
    }



}

/* Function Name  : getInitValueforElement
   Input          :
   Description    :
*/
var elemInitValue = function getInitValueforElement(i_elementId)
{
     console.log("in getInitValueforElement ");
     formMap.get(i_elementId).then(TwilioSyncToForm);

}



/* Function Name  : sendFormDataToCloud
   Input          :
   Description    :
*/
var formToTwilioSync = function sendFormDataToCloud(i_elementType,i_elementId ,i_elementName ,i_elementValue)
{

  var thisElem = $('[name="' + i_elementName + '"]').serializeArray() ;
  var thisElemValue = thisElem[0]["value"];

  var fieldAttrText = '{'
    + ' "value": "' + thisElemValue + '",'
    + ' "elementName": "' + i_elementName +'",'
    + ' "elementType": "' + i_elementType +'",'
    + ' "from": "' + endpointId + '"'
    + '}';


  /* Handle Newline characters in the JSON */
  var fieldAttrTextSanitised = fieldAttrText.replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f");

  var   fieldAttr = JSON.parse(fieldAttrTextSanitised);


  var l_formFieldAppendAttribList = new Array();
  var l_formFieldAppendAttribValueList = new Array();

  fieldName = i_elementName;
  syncThisFormElement(formMapName,fieldName,fieldAttr,l_formFieldAppendAttribList,l_formFieldAppendAttribValueList,TwilioSyncToForm);

}


$(function ()
{


  startCobrowsing(makeid(4),"TestRun212")  ;


}
);
