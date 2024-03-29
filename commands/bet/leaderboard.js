const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Leaderboard } = require('../../schemas/leaderboard');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Displays leaderboard'),
	async execute(interaction) {
        try {
            const LeaderboardDocuments = await Leaderboard.find({}).sort('-money').exec();
            console.log('Matching Leaderboard Documents:', LeaderboardDocuments);
            
            const newEmbed = new EmbedBuilder()
                .setColor('#1e8725')
                .setTitle('LEADERBOARD');
    
            for (const doc of LeaderboardDocuments) {
                newEmbed.addFields({ name: doc.username, value: `$${doc.money.toString()}`} );
            }

            await interaction.reply({ embeds: [newEmbed] });
            
        } catch (error) {
            console.error('Error:', error);
		} 
	},
};
