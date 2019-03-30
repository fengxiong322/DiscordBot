const Discord = require('discord.js');
const fs = require('fs');
const process = require('child_process');

var botConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var botToken = botConfig.token;
//var inHold = ;

const client = new Discord.Client();

client.on('ready', () => {
    console.log("Connected!");
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function output(msg, stdout, stderr, lang, icon) {
    if (stderr || stderr.trim() !== "") {
        if (stdout || stdout.trim() !== "") {
            msg.reply("Program ran with errors", {
                embed: {
                    title: "Errors",
                    color: 0xE74C3C, // #E74C3C
                    description: stderr,
                    author: {
                        name: lang,
                        icon_url: icon
                    },
                    fields: [{
                        name: "Output",
                        value: stdout
                    }]
                }
            });
        } else {
            msg.reply("Program ran with errors", {
                embed: {
                    title: "Errors",
                    color: 0xE74C3C, // #E74C3C
                    description: stderr,
                    author: {
                        name: lang,
                        icon_url: icon
                    }
                }
            });
        }
    } else {
        msg.reply("Program ran without errors", {
            embed: {
                title: "Output",
                color: 0x2ECC71, // #2ECC71
                description: stdout,
                author: {
                    name: lang,
                    icon_url: icon
                }
            }
        });
    }
}

var languages = {
    java: {
        run: function(msg, code, inputText) {
            var folder = "temp_files/";
            fs.mkdir(folder, function(err) {
                if (err) {
                    msg.reply("Could not create folder: " + err);
                    return;
                }
                var classes = [];
                var main = "null";
                var lines = fs.readFileSync("./Feng.java").toString('utf-8');
                var count = 0;
                var firstOpen = false;
                var currentSource = "";
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    for (var j = 0; j < line.length; j++) {
                        var c = line.charAt(j);
                        if (c == '{') {
                            firstOpen = true;
                            count++;
                        }
                        if (c == '}') {
                            count--;
                	}
                        currentSource += c;
                        if (firstOpen && count == 0) {
                            var classNameRegex = /class\s+([a-zA-Z_][a-zA-Z_0-9]*)\s*/g;
                            var className = classNameRegex.exec(lines)[1];
                            classes.push({
                                source: currentSource,
                                className: className
                            });
                            firstOpen = false;
                            count = 0;
                            currentSource = "";
                        }
                    }
                    currentSource += "\n";
                }

                for (var i = 0; i < classes.length; i++) {
                    var clazz = classes[i];
                    var fileName = folder + clazz.className + ".java";
                    var checkMain = /(public\s+)?static\s+void\s+main\s*\(String(\[\])?\s+[a-zA-Z_][a-zA-Z_0-9]*(\[\])?\)\s*{[^}]*}/g

                    function error(lib) {
                        output(msg, "", "The library `" + lib + "` is not allowed! Please remove it!", "Java", "<0/");
                        for (var i = 0; i < classes.length; i++) {
                            var clazz = classes[i];
                            var fileName = folder + clazz.className + ".java";
                            var className = folder + clazz.className + ".class";
                            fs.unlink(fileName, function() {});
                            fs.unlink(className, function() {});
                        }
                        fs.rmdirSync(folder);
                    }

                    var bannedClasses = [
                        "java.io.File",
                        "java.io.FileDescriptor",
                        "java.io.FileInputStream",
                        "java.io.FileOutputStream",
                        "java.io.FilePermission",
                        "java.io.FileReader",
                        "java.io.FileWriter",
                        "java.io.RandomAccessFile",
                        "java.io.*",

                        "java.lang.Process",
                        "java.lang.ProcessBuilder",
                        "java.lang.Runtime",
                        "java.lang.RuntimePermission",
                        "java.lang.*",

                        "java.lang.reflect",
                        "java.net",
                    ];

                    for (var j = 0; j < bannedClasses.length; j++) {
                        var bannedClass = bannedClasses[i];
                        if (clazz.source.includes(bannedClass)) {
                            error(bannedClass);
                            return;
                        }
                    }
                    var IO = {


                    }
                    for (var j = 0; j < IO.length; j++) {
                        var bannedClass = bannedClasses[i];
                        if (clazz.source.includes(bannedClass)) {
                            return;
                        }
                    }

                    //if (checkMain.exec(clazz.source)) {
                        main = clazz.className;
                    //}
                    fs.writeFileSync(fileName, clazz.source);
                }
                process.exec('javac -sourcepath ./hsa/ ' + className + ".java", function(err, stdout, stderr) {
                    if (err) {
                        output(msg, "", err.toString(), "Java", "http://logodatabases.com/wp-content/uploads/2012/03/java-logo-large.png");
                        for (var i = 0; i < classes.length; i++) {
                            var clazz = classes[i];
                            var fileName = folder + clazz.className + ".java";
                            var className = "./" + clazz.className + ".class";
                            try {
                                //fs.unlinkSync(fileName);
                                fs.unlinkSync(className);
                            }catch(err) {}
                        }
                        fs.rmdirSync(folder);
                        return;
                    }
                    var child = process.exec('java ' + main, {
                        cwd: "./",
                        timeout: 5000
                    }, function(err, stdout, stderr) {
                        if (err) {
                            output(msg, "", err.toString(), "Java", "http://logodatabases.com/wp-content/uploads/2012/03/java-logo-large.png");
                        } else {
                            output(msg, stdout, stderr, "Java", "http://logodatabases.com/wp-content/uploads/2012/03/java-logo-large.png");
                        }
                        for (var i = 0; i < classes.length; i++) {
                            var clazz = classes[i];
                            var fileName = folder + clazz.className + ".java";
                            var className = "./" + clazz.className + ".class";
                            fs.unlinkSync(fileName);
                            fs.unlinkSync(className);
                        }
                        fs.rmdirSync(folder);
                    });
                    if(inputText && inputText != "") child.stdin.write(inputText);
                });
            });
        }
    }
};
var consoleCommands = [
    "c.readline",
    "c.getChar"
];
client.on('message', msg => {
    var codeExtract = /```([^`]*)```/g
    if (msg.content.trim().startsWith("+run")) {
        var inputMatch, sourceMatch;
        var match1 = fs.readFileSync("./Feng.java").toString('utf-8');
        var lines = match1; 
        if (match1 != null) {
            var text = match1[1];
            var lines = text.split("\n")
            var name = lines[0].toLowerCase().trim();
            if (name == "input") {
                inputMatch = match1;
            } else {
                sourceMatch = match1;
            }
        }
        var match2 = codeExtract.exec(msg.content);
        if (match2 != null) {
            var text = match2[1];
            var lines = text.split("\n")
            var name = lines[0].toLowerCase().trim();
            if (name == "input") {
                inputMatch = match2;
            } else {
                sourceMatch = match2;
            }
        }
        
	    
        if (sourceMatch != null) {
            var text = sourceMatch[1];
            var lines = text.split("\n")
            var name = lines[0].toLowerCase().trim();
            var inputText = "";
            if(inputMatch != null) {
                var inputText = inputMatch[1].substr(6);
                if (!inputText.endsWith('\n')) {
                    inputText += "\n";
                }
            }
            var code = lines.slice(1, lines.length).join("\n");
	        var lang = languages["java"];
            lang.run(msg, code, inputText);
        }
    }
    if (msg.content.trim().startsWith("+stopcode")) {
        msg.channel.send("Code shutting down");
        setTimeout(function(){
            client.user.setStatus('invisible');
        }, 1000);
        client.destroy();
    }
});

client.login(botToken)