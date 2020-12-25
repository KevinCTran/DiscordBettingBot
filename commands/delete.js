const Discord = require('discord.js');
const { overUnderChannel, vsChannel, logChannel } = require('../config.json');

module.exports = {
	name: 'delete',
    description: 'Delete all bets',
    args: false,
	async execute(message, args, ouBets, vsBets) {    
        if (message.author.id === '325531540547436545') {
            ouBets.clear();
            vsBets.clear();
            console.log("Cleared the Maps");

            // Clear the messages from all text channels

            // Over/Under
            await message.client.channels.cache.get(overUnderChannel).messages.fetch({limit: 100}).then(messages => {
                message.client.channels.cache.get(overUnderChannel).bulkDelete(messages). then(() => {
                    message.client.channels.cache.get(overUnderChannel).send(`Cleared messages!`).then(msg => {
                        msg.delete({timeout: 3000});
                    });
                });
            }).catch((err) => {
                console.log(err);
                return message.reply("An error occured");
            });

            // VS 
            await message.client.channels.cache.get(vsChannel).messages.fetch({limit: 100}).then(messages => {
                message.client.channels.cache.get(vsChannel).bulkDelete(messages). then(() => {
                    message.client.channels.cache.get(vsChannel).send(`Cleared messages!`).then(msg => {
                        msg.delete({timeout: 3000});
                    });
                });
            }).catch((err) => {
                console.log(err);
                return message.reply("An error occured");
            });

            // Separate old logs
            await message.client.channels.cache.get(logChannel).send(`====================================================`).then(() => {
                message.client.channels.cache.get(logChannel).send(`====================================================`);
            });
        }
	},
};