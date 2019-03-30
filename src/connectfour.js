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
const black = ":black_circle:";
const blue = ":large_blue_circle:";
const red = ":red_circle:";
var turn = false;
var board;
var display = [];
var player1 = "";
var player2 = "";
var startgame = false;
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
  
  function updateDisplay(){
    var temp = "";
    display[0] = ":zero::one::two::three::four::five::six:";
    for (var i = 0; i < 6;i++){
      for (var j = 0; j < 7;j++){
       temp += board[j][i];
       display[i+1] = temp;
      }
      temp = "";
    }
  }

  function checkwin(){
      for(var i = 0; i < 6; i++)
        for(var j = 0; j < 4; j++)
          if(board[i][j] == red && board[i][j+1] == red && board[i][j+2] == red && board[i][j+3] == red)
            return 0;
      for(var i = 0; i < 3; i++)
        for(var j = 0; j < 7; j++)
          if(board[i][j] == red && board[i+1][j] == red && board[i+2][j] == red && board[i+3][j] == red)
            return 0;
      for(var i = 0; i < 3; i++)
        for(var j = 0; j < 4; j++)
          if(board[i][j] == red && board[i+1][j+1] == red && board[i+2][j+2] == red && board[i+3][j+3] == red)
            return 0;
      for(var i = 0; i < 3; i++)
        for(var j = 0; j < 4; j++)
          if(board[i+3][j] == red && board[i+2][j+1] == red && board[i+1][j+2] == red && board[i][j+3] == red)
            return 0;
      for(var i = 0; i < 6; i++)
        for(var j = 0; j < 4; j++)
          if(board[i][j] == blue && board[i][j+1] == blue && board[i][j+2] == blue && board[i][j+3] == blue)
            return 1;
      for(var i = 0; i < 3; i++)
        for(var j = 0; j < 7; j++)
          if(board[i][j] == blue && board[i+1][j] == blue && board[i+2][j] == blue && board[i+3][j] == blue)
            return 1;
      for(var i = 0; i < 3; i++)
        for(var j = 0; j < 4; j++)
          if(board[i][j] == blue && board[i+1][j+1] == blue && board[i+2][j+2] == blue && board[i+3][j+3] == blue)
            return 1;
      for(var i = 0; i < 3; i++)
        for(var j = 0; j < 4; j++)
          if(board[i+3][j] == blue && board[i+2][j+1] == blue && board[i+1][j+2] == blue && board[i][j+3] == blue)
            return 1;
      return -1;
  }

  if (!startgame){
    if (command === "setplayer1"){
      player1 = message.author.id;
      message.channel.send("You are now player 1");
    }

    if (command === "setplayer2"){
      player2 = message.author.id;
      message.channel.send("You are now player 2");
    }
  }else{
    message.channel.send("Game has already started");
  }

  if (command === "connectfour"){
    if (player1 == "" || player2 == ""){
      message.channel.send("Its a two player game dammit");
      message.channel.send("use +setplayer1 and +setplayer2");
      return;
    }
    startgame = true;
    turn = false;
    board = new Array(7);
    for (var i = 0; i < 7; i++){
      board[i]= new Array(6);
      for (var j = 0; j < 6; j++)
        board[i][j] = black;
    }
    updateDisplay();
    message.channel.send(display);
  }

  if (command === "place"){
    if (player1 !== message.author.id && !turn){
      message.channel.send("Not your turn!");
      return;
    }
    if (player2 !== message.author.id && turn){
      message.channel.send("Not your turn!");
      return;
    }

    const position = args.join(" ");
    const pos = parseInt(position, 10);
    var tempbroken = false;
    for(var i = 5; i >=0; i--){
      if (board[pos][i] === black){
        if(turn){
          board[pos][i] = red;
          turn = false;
        }
        else {
          board[pos][i] = blue;
          turn = true;
        }
        tempbroken = true;
        break;
      }
    }
    if(!tempbroken)
      message.channel.send("You cannot go there!");
    else{
      updateDisplay();
      message.channel.send(display);
    }
    if (checkwin() == 0){
      message.channel.send("Red Wins!");
      board = [];
    }else if (checkwin() == 1){
      message.channel.send("Blue Wins!"); 
      board = [];
    }
  }

    if(command === "stopconnectfour"){
    message.channel.send("WASNT THAT SO COOOOOOL?!?!?!?!?");
    client.destroy();
  }


});

client.login(config.token);