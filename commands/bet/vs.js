const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Vs } = require('../../schemas/vs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vs')
		.setDescription('Creates a VS bet')
        .addStringOption(option =>
            option.setName('firstselection')
                .setDescription("First player/team")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('secondselection')
                .setDescription("Second player/team")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('category')
                .setDescription("What is the category")
                .setRequired(true)),
	async execute(interaction) {
		const selectionOne = interaction.options.getString('firstselection').trim();
        const selectionTwo = interaction.options.getString('secondselection').trim();
        const category = interaction.options.getString('category').trim();
        
        const betString = `${selectionOne} vs ${selectionTwo} ${category}`;
        const criteria = { betString: betString }
        console.log(betString)
        const newVs = { betString: betString, betSubjectOne: selectionOne, betSubjectTwo: selectionTwo, betCategory: category }
            
        try {
            const result = await Vs.findOneAndReplace(criteria, newVs, {
                upsert: true,
                new: true,
            });
        
            if (result !== null) {
                console.log('Document found and replaced:', result);
                const Embed = new EmbedBuilder()
                    .setColor('#FDB927')
                    .setTitle('VS Bet Created')
                    .addFields(
                        {name: "Player/Team", value: selectionOne, inline: true},                   
                        {name: "Player/Team", value: selectionTwo, inline: true},  
                        {name: "Cat", value: category, inline: true},
                    );
                
                // send to general channel to show bet is created
                const gen_channel = interaction.client.channels.cache.get(process.env.MAIN_CHANNEL);
                await interaction.reply({ embeds: [Embed] });

                // send to VS channel so that users can bet 
                const ou_channel = interaction.client.channels.cache.get(process.env.VS_CHANNEL);
                const newEmbed = new EmbedBuilder()
                    .setColor('#FDB927')
                    .addFields(
                        {name: "Player/Team", value: selectionOne, inline: true},                   
                        {name: "Player/Team", value: selectionTwo, inline: true},  
                        {name: "Cat", value: category, inline: true},
                    );
                
                ou_channel.send({ embeds: [newEmbed] });
            } else {
                console.log('Document not found, a new one was created.');
            }
            } catch (error) {
                console.error('Error finding and replacing document:', error);
            }
        }
};
