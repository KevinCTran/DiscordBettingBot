const { Events } = require('discord.js');
const { Overunder } = require('../schemas/overunder');
const { Vs } = require('../schemas/vs');

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(interaction, user) {
		if (user.id === process.env.BOT_ID) return; // Skip if the bot is the one reacting to messages
		async function updateDocuments(model, criteria, pullList, pullVal) {
			try {
				console.log(`Pulling user '${pullVal}' from ${pullList}.`)
				const result = await model.findOneAndUpdate(criteria, 
					{ $pull: { [pullList]: pullVal } }, 
					{ new: true });
				
				if (result !== null) {
					console.log('Should be removed from the db list')
					return result
				}
				else {
					console.log("Didn't find document. Could not remove.");
				}
			} catch (error) {
				console.error('Error finding and replacing document:', error);
			}
        }
		
		const message = await interaction.message.channel.messages.fetch(interaction.message.id);
		const embed = message.embeds[0];
		const channel = message.channelId;

		if (message.embeds.length > 0 && !embed.fields[0].value.startsWith('~~')) {
			// The fields 
			const val1 = embed.fields[0]['value']
			const val2 = embed.fields[1]['value']
			const val3 = embed.fields[2]['value']

			var criteria;

			// Bet strings for OU and VS 
			if (channel === process.env.OU_CHANNEL) {
				// Add the user into the array of betters
				criteria = { betString:`${val1} ${val3} ${val2}`, active: true }
				console.log(`criteria: ${criteria}`);
				if (interaction.emoji.name == '⬆️') {
					await updateDocuments(Overunder, criteria, 'overBetters', user.username)
				} 
				else if (interaction.emoji.name == '⬇️') {
					await updateDocuments(Overunder, criteria, 'underBetters', user.username)
				}
			} 
			else if (channel === process.env.VS_CHANNEL) {
				criteria = criteria = { betString:`${val1} vs ${val2} ${val3}`, active: true }
				console.log(`criteria: ${criteria}`);
				if (interaction.emoji.name == '1️⃣') {
					await updateDocuments(Vs, criteria, 'oneBetters', user.username)
				} 
				else if (interaction.emoji.name == '2️⃣') {
					await updateDocuments(Vs, criteria, 'twoBetters', user.username)
				}
			} 
		}
		else {
			// Remove reaction to the message if it's inactive, make it unbettable 
			try {
				if (channel === process.env.OU_CHANNEL) {
					await message.reactions.resolve('⬇️')?.users.remove(user.id);
				} 
				else if (channel === process.env.VS_CHANNEL) {
					await message.reactions.resolve('2️⃣')?.users.remove(user.id);
				}
			} catch (error) {
				console.error(`Error removing ${user}'s reaction to inactive bet`, error);
			}
		}
	}
};