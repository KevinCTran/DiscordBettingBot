const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Replies with bot info'),
	async execute(interaction) {
		await interaction.reply(`\`\`\` Current supported commands: \n
        - !bets : Lists all bets 
        - !help : This message
        - !o/u <Player/Team> <Number> <Cat> : Creates an over/under bet 
        - !vs <Player/Team> <Player/Team> <Cat> : Creates a versus bet
        - !remove <betType (o/u, vs)> <Same params as o/u or vs>
        - !setWinners : Lists bets in #set-winners for reactions to set winners
        - !winners : Calculates and displays who owes who money\n\nReact to messages in the correct channel to place your bet
        - !leaderboard : Display total net for each gambling addict
        \`\`\``);
	},
};
// const Discord = require('discord.js');
// const { Client } = require('pg');
// require("dotenv").config();


// module.exports = {
// 	name: 'leaderboard',
//     description: 'Displays leaderboard',
//     args: false,
// 	execute(message, args, ouBets, vsBets, messageIds, winnerMap) {
//         console.log("Starting leaderboard");
//         let dbClient = new Client({
//             connectionString: process.env.DATABASE_URL,
//             ssl: {
//                 rejectUnauthorized: false
//             }
//         });
//         dbClient.connect();

//         let query = `select * from winnings`;
//         let board = [];

//         dbClient
//             .query(query)
//             .then(res => {
//                 for (i = 0; i < res.rows.length; i++) {
//                     board.push(res.rows[i]);
//                 }
                
//                 board.sort(function(a, b) {
//                     return b.amount - a.amount;
//                 });

//                 const Embed = new Discord.MessageEmbed()
//                     .setColor('#1e8725')
//                     .setTitle('LEADERBOARD');

//                 board.forEach(entry => {
//                     Embed.addField(entry.name, `$${entry.amount}`);
//                 })

//                 message.channel.send(Embed);
//             })
//             .catch(e => console.error(e.stack))
//             .finally(() => {
//                 dbClient.end();
//             });
//     },
// };