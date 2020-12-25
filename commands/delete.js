const Discord = require('discord.js');

module.exports = {
	name: 'delete',
    description: 'Delete all bets',
    args: false,
	execute(message, args, ouBets, vsBets) {    
        if (message.author.id === '325531540547436545') {
            ouBets.clear();
            vsBets.clear();
            console.log("Bets Cleared!");
        }
	},
};