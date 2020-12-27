module.exports = {
	name: 'bets',
    description: 'List all bets',
	execute(message, args, ouBets, vsBets, messageIds, winnerMap) {
		if (ouBets.size == 0 && vsBets.size == 0) {
            return message.channel.send("There are no current bets. Hurry and gamble your life away.");
        }

        message.channel.send(`**__OVER/UNDER BETS:__**`);
        if (ouBets.size === 0) message.channel.send(`> NONE`)
        for (var [key] of ouBets) {
            let dashes = ''
            for (i = 0; i < key.length; i++) {
                dashes += '-';
            }

            message.channel.send(`\`\`\`asciidoc\n${key}\n${dashes}\nOver Betters: ${[...ouBets.get(key).OVER]}\nUnder Betters: ${[...ouBets.get(key).UNDER]}\`\`\``);
        }

        message.channel.send(`**__VERSUS BETS:__**`);
        if (vsBets.size === 0) message.channel.send(`> NONE`)
        for (var [key] of vsBets) {
            let dashes = ''
            for (i = 0; i < key.length; i++) {
                dashes += '-';
            }
    
            message.channel.send(`\`\`\`asciidoc\n${key}\n${dashes}\n${key.split(' ')[0]} Betters: ${[...vsBets.get(key).ONE]}\n${key.split(' ')[2]} Betters: ${[...vsBets.get(key).TWO]}\`\`\``);
        }  
        message.channel.send("END");
	},
};