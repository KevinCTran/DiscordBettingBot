const Discord = require('discord.js');

module.exports = {
	name: 'help',
    description: 'Bot commands',
    args: false,
	execute(message, args, ouBets, vsBets) {    
        message.channel.send(`\`\`\` Very basic commands. Input is not thoroughly checked. 
        **ALWAYS** keep players/teams to one word.\n Current supported commands: \n
        \`- !bets : Lists all bets \` 
        \`- !help : This message lmao
        \`- !o/u <Player/Team> <Number> <Cat> : Creates an over/under bet 
        \`- !vs <Player/Team> <Player/Team> <Cat> : Creates a versus bet.

        React to messages to place your bet. Every bet is considered $1 for now until we aint broke.
        \`\`\``);
	},
};