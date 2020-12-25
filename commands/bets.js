module.exports = {
	name: 'bets',
    description: 'List all bets',
	execute(message, args, ouBets, vsBets) {
		if (ouBets.size == 0 && vsBets.size == 0) {
            return message.channel.send("There are no current bets. Hurry and gamble your life away.");
        }

        message.channel.send(`__**OVER/UNDER BETS:**__`);
        if (ouBets.size === 0) message.channel.send(`> NONE`)
        for (var [key] of ouBets) {
            let text = `\`${key}\n\``;
            message.channel.send(text);  
            message.channel.send(`\`\`\`Over Betters: ${[...ouBets.get(key).OVER]}\nUnder Betters: ${[...ouBets.get(key).UNDER]}\`\`\``);
        }

        message.channel.send(`__**VERSUS BETS:**__`);
        if (vsBets.size === 0) message.channel.send(`> NONE`)
        for (var [key] of vsBets) {
            let text = `\`${key}\n\``;
            message.channel.send(text);
            message.channel.send(`\`\`\`${key.split(' ')[0]} Betters: ${[...vsBets.get(key).ONE]}\n${key.split(' ')[2]} Betters: ${[...vsBets.get(key).TWO]}\`\`\``);
        }  
	},
};