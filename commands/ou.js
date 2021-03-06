const Discord = require('discord.js');
require("dotenv").config();


module.exports = {
	name: 'o/u',
    description: 'Over/Under Bet',
    args: true,
    usage: '<Player/Team> <Number> <Cat>',
	execute(message, args, ouBets, vsBets, messageIds, winnerMap) {
        if (isNaN(Number(args[1]))) {
            return message.channel.send('Bet not in correct O/U format.')
        }

        // ex. {Player/TeamName} {Number} {Cat}
        // LeBron 11 Assists
        let betString = `${args[0]} ${args[1]} ${args[2]}`;
        
        if (ouBets.has(betString)) {
            return message.channel.send("Bet already exists. Pay attention yea?")
        }

        ouBets.set(betString, {"OVER" : new Set(), "UNDER" : new Set()});
        message.client.channels.cache.get(process.env.OU_CHANNEL).send(`\`${betString}\``).then(sent => {
            let id = sent.id;
            messageIds.set(betString, id);
        });

        const Embed = new Discord.MessageEmbed()
            .setColor('#552583')
            .setTitle('O/U Bet Created')
            .addFields(
                {name: "Player/Team", value: args[0], inline: true},
                {name: "O/U", value: args[1], inline: true},
                {name: "Cat", value: args[2], inline: true},
            );

        message.channel.send(Embed);
	},
};