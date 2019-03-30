const Discord = require('discord.js')
const request = require('request')
const fs = require('fs')
var connectfouron = false;
function download(url){
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream("Feng.java"));
}

const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity("+help");
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log("I have been removed from: ${guild.name} (id: ${guild.id})");
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === "ping") {
    const m = await message.channel.send("ping");
    m.edit("Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms");
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch();
    message.channel.send(sayMessage);
  }

  if(command === "eval") {
    const sayMessage = args.join(" ");
    message.channel.send(eval(sayMessage));
  }

  if(command === "fileshare") {
    const sayMessage = args.join(" ");
    message.delete().catch();
    message.channel.send(new Discord.Attachment('hi.txt', 'hi.txt') ).catch(console.error);

  }
  if(command === "getfile") {
    if(message.attachments.first()){
        if(message.attachments.first().filename.endsWith(".java")){
          download(message.attachments.first().url);
          message.channel.send("Saved!");
        }else{
          message.channel.send("Please submit a java file!");
        }
	 
    }
  }

  if(command === "stophwhelp"){
    message.channel.send("HwHelp shutting down");
     setTimeout(function(){
         client.user.setStatus('invisible');
     }, 4000);
     client.destroy();
  }

  if(command === "cubetime"){
    const sayMessage = args.join(" ");
    var username = message.guild.members.get(message.author.id);
    user = message.member;
    user = user.toString();
    if (user.includes("!")) {
      user = user.split("!")[1].split(">")[0];
    } else {
      user = user.split("@")[1].split(">")[0];
    }
    username = client.users.get(user).username;
    fs.appendFile(username +"times.txt", "\n"+sayMessage, function(err){
      if(err){
        return console.log(err);
      }
    })
  }

 if(command === "settimer"){
    var username = message.guild.members.get(message.author.id);
    user = message.member;
    user = user.toString();
    if (user.includes("!")) {
      user = user.split("!")[1].split(">")[0];
    } else {
      user = user.split("@")[1].split(">")[0];
    }
    username = client.users.get(user).username;
    fs.writeFile(username +"times.txt", "", function(err){
      if(err){
        return console.log(err);
      }
    })
    message.channel.send("Your times file has been created: " + username + "times.txt");
  }

  if(command === "showtimes"){
    var username = message.guild.members.get(message.author.id);
    user = message.member;
    user = user.toString();
    if (user.includes("!")) {
      user = user.split("!")[1].split(">")[0];
    } else {
      user = user.split("@")[1].split(">")[0];
    }
    username = client.users.get(user).username;
    fs.readFile(username +"times.txt", (err, data) => { 
      if (err) throw err; 
      message.channel.send(data.toString()); 
    })
  }

  if (command === "startcode"){
    var exec = require('child_process').exec, child;

    child = exec('Node code.js',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });
    message.channel.send("code started");
  }
  if(!connectfouron)
    if (command === "playconnectfour"){
      var exec = require('child_process').exec, child;
      connectfouron =true;
      child = exec('Node connectfour.js',
      function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
      });
      message.channel.send("type +connectfour to get started!");
    }

  if(connectfouron && command === "stopconnectfour")
    connectfouron = false;

  if (command === "dm"){
    const sayMessage = args.join(" ");
    message.guild.members.get(config.owner).send(sayMessage);
  }
    if (command === "dmyourself"){
    const sayMessage = args.join(" ");
    message.author.send(sayMessage);
  }
  if(command === "help") {
    message.reply("Help Menu!", {
            embed: {
                title: "Help!",
                color: 0x2ECC71,
                description: "Getting help",
                fields: [{
                  name: "getFile",
                  value: "Attach a java file, and it will send the program to me. Please make sure the class name is Feng."
                },
                {
                  name: "run",
                  value: "This will run your program"
                },
                {
                  name: "getInput",
                  value: "get .in file"
                },
                {
                  name: "stopcode",
                  value: "script that runs code will be stopped(contains 'run')"
                },
                {
                  name: "stophwhelp",
                  value: "Stops the hwHelp script."
                },
                {
                  name: "startcode",
                  value: "starts the code script"
                },
                {
                  name: "dm",
                  value: "Customer Support"
                },
                {
                  name: "playconnectfour",
                  value: "Lets you play connectfour"
                }
                ]
            }
    });
  }
});

client.login(config.token);