const Discord = require('discord.js');
require("dotenv").config();


module.exports = {
	name: 'leaderboard',
    description: 'Displays leaderboard',
    args: false,
	execute(message, args, ouBets, vsBets, messageIds, winnerMap, dbClient) {
        const query = `select * from winnings`;
            let board = [];

            dbClient
                .query(query)
                .then(res => {
                    for (i = 0; i < res.rows.length; i++) {
                        board.push(res.rows[i]);
                    }
                    
                    board.sort(function(a, b) {
                        return b.amount - a.amount;
                    });

                    const Embed = new Discord.MessageEmbed()
                        .setColor('#1e8725')
                        .setTitle('LEADERBOARD');

                    board.forEach(entry => {
                        Embed.addField(entry.name, `$${entry.amount}`);
                    })

                    message.channel.send(Embed);
                })
                .catch(e => console.error(e.stack));
    },
};