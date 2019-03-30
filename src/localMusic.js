// Load up the discord.js library
const Discord = require('discord.js')
const request = require('request')
const mkdirp = require('mkdirp')
const co = require('co')
const pify = require('pify')
const fs = require('fs')
const ytdl = require("ytdl-core");
var voiceChannel;
function download(url){
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream("dab.mp3"));
}
// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
  client.user.setActivity(`+help`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  var server = message.guild;
  if(command === "playmusic") {
    //const sayMessage = args.join(" ");
    voiceChannel = client.channels.get(message.author.lastMessage.member.voiceChannelID);
    const broadcast = client.createVoiceBroadcast();
    voiceChannel.join().then(connection => {
    broadcast.playFile('./dab.mp3');
    const dispatcher = connection.playBroadcast(broadcast);}).catch(console.error);
  }
   if(command == 'stopstream') {
    const sayMessage = args.join(" ");
    //const voiceChannel = client.channels.get(message.author.lastMessage.member.voiceChannelID);
    client.destroy(message.author.voiceChannel);
  }

  if(command === "getmusic") {
    if(message.attachments.first()){//checks if an attachment is sent
        if(message.attachments.first().filename.endsWith(".mp3")){
          download(message.attachments.first().url);
          message.channel.send("Saved!");
        }else{
          message.channel.send("Please submit a music file!(and name it 'dab.mp3')");
        }
   
    }
  }

  });

client.login(config.token);