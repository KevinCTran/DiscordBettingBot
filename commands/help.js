module.exports = {
	name: 'help',
    description: 'Bot commands',
    args: false,
	execute(message, args, ouBets, vsBets, messageIds, winnerMap) {    
        message.channel.send(`\`\`\` Very basic commands. Input is not thoroughly checked.\n **ALWAYS** keep players/teams to one word.\n Current supported commands: \n
        - !bets : Lists all bets 
        - !help : This message
        - !o/u <Player/Team> <Number> <Cat> : Creates an over/under bet 
        - !vs <Player/Team> <Player/Team> <Cat> : Creates a versus bet.
        - !remove <betType (o/u, vs)> <Same params as o/u or vs>
        - !setWinners : Lists all valid bets in #set-winners channel so we can react and set which players/teams won
        - !winners : Calculates and displays who owes who money\n\nReact to messages in the correct channel to place your bet. Every bet is considered $1 for now until we aint broke.
        \`\`\``);
	},
};