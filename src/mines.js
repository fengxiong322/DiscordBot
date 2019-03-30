// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
const numbers = ["||:zero:||", "||:one:||", "||:two:||", "||:three:||", "||:four:||", "||:five:||", "||:six:||", "||:seven:||"];
const bomb = "||:bomb:||";
const start = "yay";

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

  if (command === "createmines"){
    var mines = [];
    var print = [];
    for(var i = 0; i < parseInt(args[0]); i++)
      print[i] = "";
    for(var i = 0; i < parseInt(args[2]); i++){
      mines[i] = new Array(2);
      mines[i][0] = Math.floor(Math.random() * Math.floor(args[0]));
      mines[i][1] = Math.floor(Math.random() * Math.floor(args[1]));
    }
    var counter = 0;
    for (var i = 0; i < parseInt(args[0]); i++)
      for (var j = 0; j < parseInt(args[1]);j++){
        var broken = false;
        for(var nummine = 0; nummine < parseInt(args[2]); nummine++){
          if (mines[nummine][0] == i && mines[nummine][1] == j){
            broken = true;
            break;
          }else{
            if (mines[nummine][0] == i && mines[nummine][1] == j+1)
              counter++;
            if (mines[nummine][0] == i+1 && mines[nummine][1] == j+1)
              counter++;
            if (mines[nummine][0] == i-1 && mines[nummine][1] == j+1)
              counter++;
            if (mines[nummine][0] == i && mines[nummine][1] == j-1)
              counter++;
            if (mines[nummine][0] == i+1 && mines[nummine][1] == j-1)
              counter++;
            if (mines[nummine][0] == i-1 && mines[nummine][1] == j-1)
              counter++;
            if (mines[nummine][0] == i+1 && mines[nummine][1] == j)
              counter++;
            if (mines[nummine][0] == i-1 && mines[nummine][1] == j)
              counter++;
            
          }
        }
        if(broken)
          print[i] += bomb;
        else
          print[i]+=numbers[counter];
        counter = 0;
      }
    message.channel.send(print);
  }

  if(command === "stopmines"){
    message.channel.send("WASNT THAT SO COOOOOOL?!?!?!?!?");
    client.destroy();
  }


});

client.login(config.token);