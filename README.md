# coBrowseLib
Javascript library built on top of Twilio Sync to power Co-Browsing on HTML forms . https://www.twilio.com/sync 
>####Library  : https://github.com/abhijitmehta/coBrowseLib/blob/master/syncForms.js
>Include this in any of your HTML Forms and set data-CoBrowsable="true" for the form elements that you want to be co-Browsable.

# coBrowseLib - Setting up the Demo App 

# Pre-requisites


This application should give you a ready-made starting point for writing your Co-Browsable HTML Forms using Twilio Sync. Before we begin, we need to collect all the config values we need to run the application:. Before we begin, we need to collect
all the config values we need to run the application:

| Config Value  | Description |
| :-------------  |:------------- |
Service Instance SID | Like a database for your Sync data - generate one with the curl command below.
Account SID | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
API Key | Used to authenticate - [Use the IP Messaging dev tools to generate one here](https://www.twilio.com/user/account/ip-messaging/dev-tools/api-keys).
API Secret | Used to authenticate - [just like the above, you'll get one here](https://www.twilio.com/user/account/ip-messaging/dev-tools/api-keys).

## Temporary: Generating a Service Instance

During the Sync developer preview, you will need to generate Sync service
instances via API until the Console GUI is available. Using the API key pair you
generated above, generate a service instance via REST API with this curl command:

```bash
curl -X POST https://preview.twilio.com/Sync/Services \
 -d 'FriendlyName=MySyncServiceInstance' \
 -u 'SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_api_secret'
```

## A Note on API Keys

When you generate an API key pair at the URLs above, your API Secret will only
be shown once - make sure to save this in a secure location, 
or possibly your `~/.bash_profile`.

##App Components and Access Tokens 

We have two different components  in this app

1. A client (browser) - HTML form which we will make co-browsable 
2. A server which vouches for the identity of your browser instances ( each opened co-browsable page) 

The role of server side of this app is to contact Twilio (Twilio Sync) and get an access token . The access token is passed to Client (Browser in this case) to create a client for Twilio Sync . This helps abstracting out any account information ( Account SID , API Keys ,Instance IDs ) at client side and hence enforcing secure communication between Sync client on the browser to Twilo Sync on the cloud using the Access Tokens 


>>For the simplicity of understanding the concept , I have left out user creation and maintenance . I am using randomly generated name for each page that is requested . In a real life scenario , you could create a one-to-one cobrowsing between a customer and user by implementing 


## Setting Up The Node.js Application
#### Clone this repo from github 


#### Create a configuration file for your application:

```bash
cp config.sample.js config.js

```
Edit `config.js` with the four configuration parameters we gathered from above.

####  install our dependencies from npm:

```bash
cd twilio-temp/
npm install
cd ..
npm install
```


#### Run the application 

```bash
node .
OR
nodemon
```

Your application should now be running at 

```bash
http://localhost:3000/firstSync
```

Open this page in a couple browsers or tabs, and start syncing!

## License

MIT
