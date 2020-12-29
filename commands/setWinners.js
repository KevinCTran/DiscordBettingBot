require("dotenv").config();

module.exports = {
	name: 'setWinners',
    description: 'List all bets so we can set who won',
	execute(message, args, ouBets, vsBets, messageIds, dbClient) {
		if (ouBets.size == 0 && vsBets.size == 0) {
            return message.channel.send("There are no current bets. Hurry and gamble your life away.");
        }

        let WIN_CHANNEL = message.client.channels.cache.get(process.env.WIN_CHANNEL);
        let empty = "";
        let amtSent = 0;

        if (ouBets.size == 0)
            empty = `> NONE`;
        WIN_CHANNEL.send(`**__OVER/UNDER BETS:__**\n${empty}`);
        for (var [key] of ouBets) {
            let overBetters = [...ouBets.get(key).OVER].sort();
            let underBetters = [...ouBets.get(key).UNDER].sort();

            if (overBetters.length == 0 || underBetters.length == 0) 
                continue;

            let dashes = '';
            for (i = 0; i < key.length; i++) {
                dashes += '-';
            }
            
            WIN_CHANNEL.send(`\`\`\`asciidoc\n${key}\n${dashes}\nOver Betters: ${overBetters}\nUnder Betters: ${underBetters}\`\`\``);
            amtSent++;
        }
        if (ouBets.size > 0 && amtSent == 0) {
            WIN_CHANNEL.send(`> NONE. (There are no settable bets)`);
        }

        empty = "";
        amtSent = 0
        if (vsBets.size == 0)
            empty = `> NONE`;
        WIN_CHANNEL.send(`**__VERSUS BETS:__**\n${empty}`);
        for (var [key] of vsBets) {
            let oneBetters = [...vsBets.get(key).ONE].sort();
            let twoBetters = [...vsBets.get(key).TWO].sort();

            if (oneBetters.length == 0 || twoBetters.length == 0) 
                continue;
            
            let dashes = '';
            for (i = 0; i < key.length; i++) {
                dashes += '-';
            }
    
            WIN_CHANNEL.send(`\`\`\`asciidoc\n${key}\n${dashes}\n${key.split(' ')[0]} Betters: ${oneBetters}\n${key.split(' ')[2]} Betters: ${twoBetters}\`\`\``);
            amtSent++;
        }  
        if (vsBets.size > 0 && amtSent == 0) {
            WIN_CHANNEL.send(`> NONE. (There are no settable bets)`);
        }
        WIN_CHANNEL.send("END");

        message.channel.send("Please set the winners in the \`#set-winners\` channel.")
	},
};