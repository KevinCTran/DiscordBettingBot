const Discord = require('discord.js');
const { vsChannel } = require('../config.json');

module.exports = {
	name: 'vs',
    description: 'Versus Bet',
    args: true,
    maincommand: true,
    usage: '<Player/Team> <Player/Team> <Cat>',
	execute(message, args, ouBets, vsBets) {    
        // ex. {Player} {Player} {Stat}
        let betString = `${args[0]} vs ${args[1]} ${args[2]}`;
        if (vsBets.has(betString)) {
            return message.channel.send("Bet already exists. Pay attention yea?")
        }
        vsBets.set(betString, {"ONE" : new Set(), "TWO" : new Set()});
        message.client.channels.cache.get(vsChannel).send(`\`${betString}\``);

        const Embed = new Discord.MessageEmbed()
            .setColor('#FDB927')
            .setTitle('Versus Bet Created')
            .addFields(
                {name: "Player/Team", value: args[0], inline: true},
                {name: "Player/Team", value: args[1], inline: true},
                {name: "Cat", value: args[2], inline: true},
            );

        message.channel.send(Embed);
	},
};