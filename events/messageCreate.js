const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		const channel = interaction.channelId;

		if (channel === process.env.OU_CHANNEL) {
			await interaction.react('⬆️')
			await interaction.react('⬇️')
		} else if (channel === process.env.VS_CHANNEL) {
			await interaction.react('1️⃣')
			await interaction.react('2️⃣')
		}
	}
};