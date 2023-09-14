const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Overunder } = require('../../schemas/overunder');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ou')
		.setDescription('Creates an O/U bet')
        .addStringOption(option =>
            option.setName('subject')
                .setDescription("Who are we creating the O/U for")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('category')
                .setDescription("What are we betting on (pts, rec yds, tds...)")
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('line')
                .setDescription("What is the line for the bet")
                .setRequired(true)),
	async execute(interaction) {
		const subject = interaction.options.getString('subject').trim();
        const category = interaction.options.getString('category').trim();
        const line = interaction.options.getNumber('line');
        
        const betString = `${subject} ${category} ${line}`;
        const criteria = { betString: betString }
        console.log(betString)
        const newOu = { betString: betString, betSubject: subject, betStat: category, betLine: line }
            
        try {
            const result = await Overunder.findOneAndReplace(criteria, newOu, {
                upsert: true,
                new: true,
            });
        
            if (result !== null) {
                console.log('Document found and replaced:', result);
                const Embed = new EmbedBuilder()
                    .setColor('#552583')
                    .setTitle('O/U Bet Created')
                    .addFields(
                        {name: "Player/Team", value: subject, inline: true},                   
                        {name: "Line", value: line.toString(), inline: true},
                        {name: "Cat", value: category, inline: true},
                    );
                
                // send to general channel to show bet is created
                const gen_channel = interaction.client.channels.cache.get(process.env.MAIN_CHANNEL);
                await interaction.reply({ embeds: [Embed] });

                // send to O/U channel so that users can bet 
                const ou_channel = interaction.client.channels.cache.get(process.env.OU_CHANNEL);
                const newEmbed = new EmbedBuilder()
                    .setColor('#552583')
                    .addFields(
                        {name: "Player/Team", value: subject, inline: true},                   
                        {name: "Line", value: line.toString(), inline: true},
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
