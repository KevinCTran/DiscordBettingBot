const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Overunder } = require('../schemas/overunder');
const { Vs } = require('../schemas/vs');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		async function updateDocuments(model, criteria, winnerVal) {
			try {
				const result = await model.findOneAndUpdate(criteria, 
					{ $set: { winner: winnerVal } }, 
					{ new: true });
				
				if (result !== null) {
					console.log('Winner should be updated')
				}
				else {
					console.log("Didn't find document. Not adding new entry.");
				}
			} catch (error) {
				console.error('Error finding and replacing document:', error);
			}
        }

		if (!interaction.isButton()) return;
		
		// Disable the button after being clicked
		const { customId } = interaction;
		const buttonId = customId.split('#')[0]
		const betString = customId.split('#')[1]
		const label1 = interaction.message.components[0].components[0].data.label
		const label2 = interaction.message.components[0].components[1].data.label
		const id1 = interaction.message.components[0].components[0].data.custom_id.split('#')[0]
		const id2 = interaction.message.components[0].components[1].data.custom_id.split('#')[0]

		const new_button1 = new ButtonBuilder()
			.setCustomId(id1)
			.setLabel(label1)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);

		const new_button2 = new ButtonBuilder()
			.setCustomId(id2)
			.setLabel(label2)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);
		
		if (buttonId === id1) {
			new_button1.setStyle(ButtonStyle.Success)
		}
		else {
			new_button2.setStyle(ButtonStyle.Success)
		}

		const row = new ActionRowBuilder()
			.addComponents(new_button1, new_button2);
		
		const message = await interaction.message.channel.messages.fetch(interaction.message.id);
        message.edit({
          components: [row],
        });

		// Update the document to set the winner
		if (buttonId.startsWith('under') || customId.startsWith('over')) {
			await updateDocuments(Overunder, {betString: betString, active: true}, buttonId)
		} else {
			await updateDocuments(Vs, {betString: betString, active: true}, buttonId)
		}

		interaction.deferUpdate();
	},
};