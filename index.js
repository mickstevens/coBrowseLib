// Load app dependencies
var http = require('http'),
    path = require('path'),
    express = require('express'),
    twilio = require('twilio');

const config = require('./config.js');
var twiliAccntInfoFromFile=config.getTwiliAccountSettingsfromFile ;




if (twiliAccntInfoFromFile !="Y" )
   {
     console.log("Loading Configuration from environment");
     // Load configuration information from system environment variables
     var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
         TWILIO_SYNC_SID = process.env.TWILIO_SYNC_SERVICE_SID ,
         TWILIO_SYNC_API_KEY = process.env.TWILIO_SYNC_API_KEY,
         TWILIO_SYNC_API_SECRET = process.env.TWILIO_SYNC_API_SECRET;
   }
else
   {
     console.log("Loading Configuration from config.js");
     // Load configuration information config file
     var TWILIO_ACCOUNT_SID = config.accountSid;
         TWILIO_SYNC_SID = config.serviceSid ,
         TWILIO_SYNC_API_KEY = config.apiKey,
         TWILIO_SYNC_API_SECRET =  config.apiSecret;
   }





//For Sync
//twilio-temp till the point Sync Accesstoken is included in the standard twilio helper libary .Toggle the two lines below then.
  var AccessToken = twilio.jwt.AccessToken;
//var AccessToken = require('./twilio-temp').AccessToken;
var SyncGrant = AccessToken.SyncGrant;

// Express specific
var app = express();

// view engine setup

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'css')));



//AM: Start Here


app.get("/getToken",function(i_Req,o_Res)
         {
            var identity=i_Req.query.identity;
            var endPointId=i_Req.query.endpointId;

            console.log("About to get token");
            console.log( "TWILIO_SYNC_SID:"+TWILIO_SYNC_SID);
            console.log( "endPointId:"+endPointId);
            console.log( "identity:"+identity);
            // Create a "grant" which enables a client to use Sync as a given user,
            // on a given endpoint
            var syncGrant = new SyncGrant(
                                          {
                                           serviceSid: TWILIO_SYNC_SID,
                                           endpointId: endPointId
                                          }
                                         );

            console.log( "syncGrant:"+syncGrant);
            // Create an access token which we will sign and return to the client,
            // containing the grant we just created

            console.log( "TWILIO_ACCOUNT_SID:"+TWILIO_ACCOUNT_SID);
            console.log( "TWILIO_SYNC_API_KEY:"+TWILIO_SYNC_API_KEY);
            console.log( "TWILIO_SYNC_API_SECRET"+TWILIO_SYNC_API_SECRET);
            var token = new AccessToken( TWILIO_ACCOUNT_SID, TWILIO_SYNC_API_KEY, TWILIO_SYNC_API_SECRET);
            console.log( "token:"+token);


            token.addGrant(syncGrant);
            token.identity = identity;

            console.log( "token:"+token.toJwt());

            // Serialize the token to a JWT string and include it in a JSON response
            o_Res.send(
                          {
                           identity: identity,
                           token: token.toJwt()
                          }
                      );


         }
      );



app.get("/firstSync" , function(req,res)
 {
    res.sendFile(__dirname+"/theFirstSync.html");
 }
);

app.get("/firstSyncStart" , function(req,res)
 {
    res.sendFile(__dirname+"/theFirstSyncStart.html");
 }
);




//AM: Ends  Here


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});




//AM: Ends  Here

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

// Create http server and run it
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Express server running on *:' + port);
});
