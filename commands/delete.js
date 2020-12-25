const Discord = require('discord.js');
require("dotenv").config();


module.exports = {
	name: 'delete',
    description: 'Delete all bets',
    args: false,
	async execute(message, args, ouBets, vsBets, messageIds) {    
        if (message.author.id === '325531540547436545') {
            ouBets.clear();
            vsBets.clear();
            console.log("Cleared the Maps");

            // Clear the messages from all text channels

            // Over/Under
            await message.client.channels.cache.get(process.env.OU_CHANNEL).messages.fetch({limit: 100}).then(messages => {
                message.client.channels.cache.get(process.env.OU_CHANNEL).bulkDelete(messages). then(() => {
                    message.client.channels.cache.get(process.env.OU_CHANNEL).send(`Cleared messages!`).then(msg => {
                        msg.delete({timeout: 3000});
                    });
                });
            }).catch((err) => {
                console.log(err);
                return message.reply("An error occured");
            });

            // VS 
            await message.client.channels.cache.get(process.env.VS_CHANNEL).messages.fetch({limit: 100}).then(messages => {
                message.client.channels.cache.get(process.env.VS_CHANNEL).bulkDelete(messages). then(() => {
                    message.client.channels.cache.get(process.env.VS_CHANNEL).send(`Cleared messages!`).then(msg => {
                        msg.delete({timeout: 3000});
                    });
                });
            }).catch((err) => {
                console.log(err);
                return message.reply("An error occured");
            });

            // Separate old logs
            await message.client.channels.cache.get(process.env.LOG_CHANNEL).send(`====================================================`).then(() => {
                message.client.channels.cache.get(process.env.LOG_CHANNEL).send(`====================================================`);
            });
        }
	},
};