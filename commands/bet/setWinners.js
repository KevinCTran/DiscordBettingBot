const { ActionRowBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Overunder } = require('../../schemas/overunder');
const { Vs } = require('../../schemas/vs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setwinners')
		.setDescription('Calculates winners'),
	async execute(interaction) {
		// 1. Query the database and get ALL bets
        // 2. Ask user who won each bet 
        // 3. Fill in the bets on the database on winners ('active: True')
        // 4. When people react to a message, also update the entry in the db
        // 5. now, we know who bet on what team, so just calculate
        // 6. update the leaderboard schema 
		await interaction.reply("Displaying active bets")
		
		try {
			const OverunderDocuments = await Overunder.find({ overBetters: { $ne: [] }, underBetters: { $ne: [] }, active: true }).exec();
			console.log('Matching Overunder Documents:', OverunderDocuments);
			for (const doc of OverunderDocuments) {
				const over = new ButtonBuilder()
					.setCustomId(`overBetters#${doc.betString}`)
					.setLabel("Over")
					.setStyle(ButtonStyle.Primary);

				const under = new ButtonBuilder()
					.setCustomId(`underBetters#${doc.betString}`)
					.setLabel('Under')
					.setStyle(ButtonStyle.Primary);
				
				const row = new ActionRowBuilder()
					.addComponents(over, under);
				
				interaction.channel.send({
					content: `${doc.betSubject} ${doc.betLine.toString()} ${doc.betStat}?`,
					components: [row],
				});
			}

			const VsDocuments = await Vs.find({ oneBetters: { $ne: [] }, twoBetters: { $ne: [] }, active: true }).exec();
			console.log('Matching VS Documents:', VsDocuments);
			for (const doc of VsDocuments) {
				const one = new ButtonBuilder()
					.setCustomId(`oneBetters#${doc.betString}`)
					.setLabel(doc.betSubjectOne)
					.setStyle(ButtonStyle.Primary);

				const two = new ButtonBuilder()
					.setCustomId(`twoBetters#${doc.betString}`)
					.setLabel(doc.betSubjectTwo)
					.setStyle(ButtonStyle.Primary);
				
				const row = new ActionRowBuilder()
					.addComponents(one, two);
				
				interaction.channel.send({
					content: `Who won ${doc.betCategory}?`,
					components: [row],
				});
			}
		} catch (error) {
			console.error('Error:', error);
		} 
	}
};
