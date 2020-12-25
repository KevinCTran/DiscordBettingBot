const fs = require('fs');
const Discord = require('discord.js');
//const { prefix, token } = require('./config.json');
const { Console } = require('console');

const client = new Discord.Client({intents: Discord.Intents.ALL});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('READY');
});

var prefix = '!';
var ouBets = new Map();
var vsBets = new Map();

client.on('message', message => {
    // Default reactions if message is by bot and is o/u or vs
    if (!message.content.startsWith('\`')) return;
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
});


client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return; 

    const command = client.commands.get(commandName);

    if (command.args && args.length != 3) {
        let reply = `${message.author}, you play on the Bulls or something?`;

        if (command.usage) {
            reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args, ouBets, vsBets);
    } catch (error) {
        console.log(error);
        message.reply("That command aint make sense my guy");
    }
});

client.on('messageReactionAdd', (messageReaction, user) => {
    if (user.id === '791571908511531010' || !messageReaction.message.content.startsWith('\`')) return;

    // Only the messages sent by the bot 
    if (messageReaction.message.author.id === '791571908511531010') {
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
            messageReaction.message.channel.send(`> ${user} placed an \`${emoji}\` bet for \`${key}\``);
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
            messageReaction.message.channel.send(`> ${user} placed a bet on \`${key.split(' ')[index]}\` for \`${key}\``);
        }
    }
});

client.on('messageReactionRemove', (messageReaction, user) => {
    if (user.id === '791571908511531010' || !messageReaction.message.content.startsWith('\`')) return;

    // Only the messages sent by the bot 
    if (messageReaction.message.author.id === '791571908511531010') {
        var msgSplit = messageReaction.message.content.slice(1).trim().split(' ');

        if (msgSplit.length === 3 && !isNaN(Number(msgSplit[1]))) {
            var key = messageReaction.message.content.slice(1).slice(0,-1).trim();
            
            // Objects in map will be :
            // { "_BETNAME" : [
            //         "OVER":[], 
            //         "UNDER":[]
            //     ] 
            // }
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
            messageReaction.message.channel.send(`> ${user} removed an \`${emoji}\` bet for \`${key}\``);
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
            messageReaction.message.channel.send(`> ${user} removed a bet on \`${key.split(' ')[index]}\` for \`${key}\``);
        }
    }
});

client.login(process.env.DJS_TOKEN);