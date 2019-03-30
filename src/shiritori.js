// Load up the discord.js library
const Discord = require("discord.js");
var fs = require("fs");
// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
var array = fs.readFileSync('words_alpha.txt').toString().split("\n");
// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
var lastbotletter;
var lastplayerletter;
var usedwords = [];

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
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

  function generateWord(){
    var temp;
    do{
      temp = array[Math.floor(Math.random() * 370099)];
      for(var i = 0; i < usedwords.length; i++)
        if(usedwords[i] == temp)
          temp = " ";
    }while (temp.substring(0, 1) != lastplayerletter);
    lastbotletter = temp.substring(temp.length-2, temp.length-1);
    return temp;
  }

  function checkWord(word){
    var max = 370099;
    var min = 0;
    var pos = Math.floor((min+max)/2);
    while (true){
      var compare = word.localeCompare(array[pos].substring(0, array[pos].length-1));
      if(compare == 1)
        min = pos;
      else if (compare == 0)
        return true;
      else if(compare == -1)
        max=pos;
      if(min+1 == max)
        return false;
      pos = Math.floor((min+max)/2);
    }
  }

  if (command === "shiritori"){
    usedwords = [];
    var temp = array[Math.floor(Math.random() * 370099)];
    usedwords.push(temp);
    lastbotletter = temp.substring(temp.length-2, temp.length-1);
    message.channel.send(temp);
  }

  if(command === "word"){
    var temp = args[0].substring(0, 1);
    if (temp === lastbotletter){
      for(var i = 0; i < usedwords.length; i++)
        if(usedwords[i] == args[0]){
          message.channel.send("This word has been used!");
          return;
        }
      if(checkWord(args[0])){
        lastplayerletter = args[0].substring(args[0].length-1);
        usedwords.push(args[0]);
        var genword = generateWord();
        usedwords.push(genword);
        message.channel.send(genword);
      }
      else
        message.channel.send("Not a word");
    }else
      message.channel.send("Your word should start with " + lastbotletter);
  }

  if(command === "stopshiritori"){
    message.channel.send("WASNT THAT SO COOOOOOL?!?!?!?!?");
    client.destroy();
  }

});

client.login(config.token);