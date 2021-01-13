require("dotenv").config();


module.exports = {
	name: 'remove',
    description: 'Remove a created bet',
    args: false, // TODO: FIX THIS LOGIC
    usage: '<BetType> <exact string bet was made with>',
	execute(message, args, ouBets, vsBets, messageIds, winnerMap) {    
        let betType = args[0];
        if (betType === "o/u") {
            
            let key = message.content.split(' ').slice(2).join(' ').toLowerCase();
            if (ouBets.has(key)) {
                let messageId = messageIds.get(key);
                
                ouBets.delete(key);
                message.client.channels.cache.get(process.env.OU_CHANNEL).messages.fetch(messageId).then(message => {
                    message.delete().then(() => {});
                });
                
                message.reply("successfully removed");
            } else {
                message.reply(`that bet doesn't exist`);
            }
        }
        else if (betType === "vs") {
            let key = `${args[1]} vs ${args[2]} ${args[3]}`.toLowerCase()
            
            if (vsBets.has(key)) {
                let messageId = messageIds.get(key);

                vsBets.delete(key);
                message.client.channels.cache.get(process.env.VS_CHANNEL).messages.fetch(messageId).then(message => {
                    message.delete();
                });

                message.reply("successfully removed");
            } else {
                message.reply(`that bet doesn't exist`);
            }   
        }
	},
};