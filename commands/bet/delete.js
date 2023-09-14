const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require("mongoose");
const { Overunder } = require('../../schemas/overunder');
const { Vs } = require('../../schemas/vs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Mark all bets as non active'),
	async execute(interaction) {
        async function updateDocuments(model) {
            try {
            // Update all documents where fieldName matches a condition
            const result = await model.updateMany(
                { active: { $eq: true } }, 
                { $set: { active: false } } 
            );
        
            console.log(`Updated ${result.nModified} documents.`);
            } catch (error) {
            console.error('Error updating documents:', error);
            }
        }

        async function strikeMessages(channel, channel_type) {
            try {
                // Fetch all messages in the channel
                const messages = await channel.messages.fetch({ limit: 50 });
            
                // Iterate through messages and edit them with strikethrough text
                messages.forEach(async (message) => {
                    const embed = message.embeds[0];
                    if (message.embeds.length > 0 && !embed.fields[0].value.startsWith('~~')) {
                        const val1 = embed.fields[0]['value']
                        const val2 = embed.fields[1]['value']
                        const val3 = embed.fields[2]['value']

                        const tempEmbed = new EmbedBuilder();
                        if (channel_type === 'ou') {
                            tempEmbed
                                .setColor('#808080')
                                .addFields(
                                    {name: "~~Player/Team~~", value: val1, inline: true},                   
                                    {name: "~~Line~~", value: val2, inline: true},
                                    {name: "~~Cat~~", value: val3, inline: true},
                                );
                        } else if (channel_type == 'vs') {
                            tempEmbed
                                .setColor('#808080')
                                .addFields(
                                    {name: "~~Player/Team~~", value: val1, inline: true},                   
                                    {name: "~~Player/Team~~", value: val2, inline: true},
                                    {name: "~~Cat~~", value: val3, inline: true},
                                );
                        }

                        await message.edit({ embeds: [tempEmbed] });
                    }
                });
            
                console.log('All messages edited with strikethrough text.');
                } catch (error) {
                console.error('Error editing messages:', error);
            }
        }

        updateDocuments(Overunder);
        updateDocuments(Vs);

        // Strikethrough all previous messages in the bet channel
        const ouChannel = interaction.client.channels.cache.get(process.env.OU_CHANNEL);
        const vsChannel = interaction.client.channels.cache.get(process.env.VS_CHANNEL);


        strikeMessages(ouChannel, "ou");
        strikeMessages(vsChannel, "vs");

        await interaction.reply("All bets removed");
    }
};
