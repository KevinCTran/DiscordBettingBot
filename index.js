const fs = require('fs');
const Discord = require('discord.js');
require("dotenv").config();

const client = new Discord.Client({intents: Discord.Intents.ALL});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name.toLowerCase(), command);
}

client.once('ready', () => {
    console.log('Bot is ready!');
});


var ouBets = new Map();
var vsBets = new Map();
var messageIds = new Map();
var winnerMap = new Map();


// ONLY reacts to bets created
client.on('message', message => {
    if (!message.content.startsWith('\`')) return;
    
    if (message.channel.id === process.env.OU_CHANNEL || message.channel.id === process.env.VS_CHANNEL) {
        var msgSplit = message.content.slice(1).trim().split(' ');
        if (message.author.id === '791571908511531010') {
            if (msgSplit.length === 3 && !isNaN(Number(msgSplit[1]))) {   
                message.react('⬆️').then(r => {
                    message.react('⬇️');
                });
            }
            else if (msgSplit.length === 4 && msgSplit[1] === "vs") {
                message.react('1️⃣').then(r => {
                    message.react('2️⃣');
                });
            }
        }
    }
    // set-winners 
    else if (message.channel.id ===  process.env.WIN_CHANNEL) {
        let splitMsg = message.content.split('\n');
        if (splitMsg[3].includes("Over") && message.content.split('\n')[4].includes("Under")) {
            // O/U
            message.react('⬆️').then(r => {
                message.react('⬇️');
            });
        }
        else if (splitMsg[1].includes("vs")) {
            // VS
            message.react('1️⃣').then(r => {
                message.react('2️⃣');
            });
        }
    }
});


// Any other command
client.on('message', message => {
    if (!message.content.startsWith(process.env.PREFIX)) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().toLowerCase().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return; 

    const command = client.commands.get(commandName);

    if (command.args && args.length != 3) {
        let reply = `${message.author}, you play on the Bulls or something?`;

        if (command.usage) {
            reply += `\nThe proper usage is: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        // Only execute if message is from the same server
        if (message.channel.id === message.client.channels.cache.get(process.env.MAIN_CHANNEL).id)
            command.execute(message, args, ouBets, vsBets, messageIds, winnerMap);
    } catch (error) {
        console.log(error);
        message.reply("That command aint make sense my guy");
    }
});

client.on('messageReactionAdd', (messageReaction, user) => {
    if (user.id === '791571908511531010' || !messageReaction.message.content.startsWith('\`')) return;

    // Only the messages sent by the bot 
    if (messageReaction.message.author.id === '791571908511531010') {
        if (messageReaction.message.channel.id === process.env.OU_CHANNEL || messageReaction.message.channel.id === process.env.VS_CHANNEL) {
            var msgSplit = messageReaction.message.content.slice(1).slice(0,-1).trim().split(' ');

            if (msgSplit.length === 3 && !isNaN(Number(msgSplit[1]))) {
                var key = messageReaction.message.content.slice(1).slice(0,-1).trim();
                var ouObject = ouBets.get(key);
                var emoji = '';

                if (messageReaction._emoji.name === '⬆️') {
                    emoji = 'OVER';
                    if (ouObject.OVER.has(user.username)) {
                        return messageReaction.message.channel.send(`> ${user} already has an OVER bet for \`${key}\``);
                    } else {
                        ouObject.OVER.add(user.username);
                    }
                } else if (messageReaction._emoji.name === '⬇️') {
                    emoji = 'UNDER';
                    if (ouObject.UNDER.has(user.username)) {
                        return messageReaction.message.channel.send(`> ${user} already has an UNDER bet for \`${key}\``);
                    } else {
                        ouObject.UNDER.add(user.username);
                    }
                }

                ouBets.set(key, ouObject);
                messageReaction.message.client.channels.cache.get(process.env.LOG_CHANNEL).send(`> ${user} placed an \`${emoji}\` bet for \`${key}\``);
            } 
            else if (msgSplit.length === 4 && msgSplit[1] === "vs") {
                var key = messageReaction.message.content.slice(1).slice(0,-1).trim();            
                var vsObject = vsBets.get(key);
                let index;

                if (messageReaction._emoji.name === '1️⃣') {
                    index = 0;
                    if (vsObject.ONE.has(user.username)) {
                        return messageReaction.message.channel.send(`> ${user} already has bet on \`${key.split(' ')[index]}\` for \`${key}\``);
                    } else {
                        vsObject.ONE.add(user.username);
                    }
                } else if (messageReaction._emoji.name === '2️⃣') {
                    index = 2;
                    if (vsObject.TWO.has(user.username)) {
                        return messageReaction.message.channel.send(`> ${user} already has bet on \`${team.split(' ')[index]}\` for \`${team}\``);
                    } else {
                        vsObject.TWO.add(user.username);
                    }
                }

                vsBets.set(key, vsObject);   
                messageReaction.message.client.channels.cache.get(process.env.LOG_CHANNEL).send(`> ${user} placed a bet on \`${key.split(' ')[index]}\` for \`${key}\``);
            }
        }
        else if (messageReaction.message.channel.id === process.env.WIN_CHANNEL) {
            let splitMsg = messageReaction.message.content.split('\n');
            if (splitMsg[3].includes("Over") && splitMsg[4].includes("Under")) {
                // O/U
                let key = splitMsg[1];
                let winner = "";
                if (messageReaction._emoji.name === '⬆️') {
                    winner = "OVER";
                } 
                else if (messageReaction._emoji.name === '⬇️') {
                    winner = "UNDER";
                }
                winnerMap.set(key, winner);
            }
            else if (splitMsg[1].includes("vs")) {
                // VS
                let key = splitMsg[1];
                let winner = "";
                if (messageReaction._emoji.name === '1️⃣') {
                    winner = "ONE";
                } 
                else if (messageReaction._emoji.name === '2️⃣') {
                    winner = "TWO";
                }
                winnerMap.set(key, winner);
            }
        }
    }
});

client.on('messageReactionRemove', (messageReaction, user) => {
    if (user.id === '791571908511531010' || !messageReaction.message.content.startsWith('\`')) return;

    // Only the messages sent by the bot in active-bet channel
    if (messageReaction.message.author.id === '791571908511531010') {
        if (messageReaction.message.channel.id === process.env.OU_CHANNEL || messageReaction.message.channel.id === process.env.VS_CHANNEL) {
            var msgSplit = messageReaction.message.content.slice(1).trim().split(' ');

            if (msgSplit.length === 3 && !isNaN(Number(msgSplit[1]))) {
                var key = messageReaction.message.content.slice(1).slice(0,-1).trim();
                
                var ouObject = ouBets.get(key);
                var emoji = '';
                if (messageReaction._emoji.name === '⬆️') {
                    if (!ouObject.OVER.has(user.username)) {
                        return messageReaction.message.channel.send(`${user} has no OVER bet for \`${key}\``);
                    } else {
                        ouObject.OVER.delete(user.username);
                    }
                    emoji = 'OVER';
                } else if (messageReaction._emoji.name === '⬇️') {
                    if (!ouObject.UNDER.has(user.username)) {
                        return messageReaction.message.channel.send(`${user} has no UNDER bet for \`${key}\``);
                    } else {
                        ouObject.UNDER.delete(user.username);                
                    }
                    emoji = 'UNDER';
                }

                ouBets.set(key, ouObject);
                messageReaction.message.client.channels.cache.get(process.env.LOG_CHANNEL).send(`> ${user} removed an \`${emoji}\` bet for \`${key}\``);
            } 
            else if (msgSplit.length === 4 && msgSplit[1] === "vs") {
                var key = messageReaction.message.content.slice(1).slice(0,-1).trim();
                var vsObject = vsBets.get(key);
                let index;

                if (messageReaction._emoji.name === '1️⃣') {
                    index = 0;
                    if (!vsObject.ONE.has(user.username)) {
                        return messageReaction.message.channel.send(`${user} has no bet on \`${key.split(' ')[index]}\``);
                    } else {
                        vsObject.ONE.delete(user.username);
                    }
                } else if (messageReaction._emoji.name === '2️⃣') {
                    index = 2;
                    if (!vsObject.TWO.has(user.username)) {
                        return messageReaction.message.channel.send(`${user} has no bet on \`${key.split(' ')[index]}\``);
                    } else {
                        vsObject.TWO.delete(user.username);
                    }
                }
    
                vsBets.set(key, vsObject);   
                messageReaction.message.client.channels.cache.get(process.env.LOG_CHANNEL).send(`> ${user} removed a bet on \`${key.split(' ')[index]}\` for \`${key}\``);
            }
        }
        else if (messageReaction.message.channel.id === process.env.WIN_CHANNEL) {
            let splitMsg = messageReaction.message.content.split('\n');
            if (splitMsg[3].includes("Over") && splitMsg[4].includes("Under")) {
                // O/U
                let key = splitMsg[1];
                winnerMap.delete(key);
            }
            else if (splitMsg[1].includes("vs")) {
                // VS
                let key = splitMsg[1];
                winnerMap.delete(key);
            }
            // CAN CLEAN ABOVE UP EASILY
        }
    }
});

client.login(process.env.TOKEN);