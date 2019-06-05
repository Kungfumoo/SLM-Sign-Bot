
const Discord = require('discord.js');
const MessageHandler = require('./MessageHandler');
const UpdateSheet = require('./UpdateSheet');
const readline = require('readline');
const {google} = require('googleapis');
const  GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./credentials.json');

const client = new Discord.Client();
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/*###################################################
                  SCRIPT EXECUTION
###################################################*/

fs.readFile('credentials.json', (err, content) => {

  if(err)
  {
    return console.log('Error loading client secret file:', err);
  }
  var creds = JSON.parse(content);

  discordLogin(creds.bot_secret);

});

var doc =  new GoogleSpreadsheet('19zU2Dz78yuttROuU0z54j2S2Fy2gG_gthiE5qrLqsYU');

InitialiseSheet(credentials);


/*##################################################
                  EVENTS
###################################################*/


client.on('ready', () => {
    var generalChannel = client.channels.get("578526874230194198"); //general channel. Replace with bot speak
    generalChannel.send("Sign-Bot has joined the party.");
});

client.on('message', (receivedMessage) => 
{
  if (receivedMessage.author == client.user) 
  { //prevent replying to own messages      
    return
  }
    
  var message = receivedMessage.content;
  var channel = receivedMessage.channel;
  var response = "";
  var senderID = receivedMessage.author.id;

  doc.useServiceAccountAuth(credentials, function(err)
  {
    doc.getInfo(function(err, info)
    {  
      response = MessageHandler.HandleMessage(message, info, client, channel, senderID);
    
      if((response != "") && (response != null))
      {
        receivedMessage.channel.send(response);
      }
    });       
  });
});


/*##################################################
                    FUNCTIONS
###################################################*/

function discordLogin(bot_secret)
{
  try
  {
    client.login(bot_secret); 
  }
  catch(err)
  {
    console.log('Error logging the bot into discord: ', err);
  }
}

function InitialiseSheet(credentials)
{
  doc.useServiceAccountAuth(credentials, function(err)
  {
    doc.getInfo(function(err, info)
    {

      console.log('Loaded doc: ' + info.title);    
      //UpdateSheet.StartUp(info); //TOCHECK -> turn this on if necessary. its also not working

    });
       
  });
}








