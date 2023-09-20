const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Overunder } = require('../../schemas/overunder');
const { Vs } = require('../../schemas/vs');
const { Leaderboard } = require('../../schemas/leaderboard');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('winners')
		.setDescription('Calculates and displays winner based on values set'),
	async execute(interaction) {
		/*
        1. Get all active bets from both OU and VS
        2. Since we now know the winner, calculate who was in the betLists for the winner and loser 
        3. Populate dictionary with values of who owes who. Everyone pays everyone now
        4. After calculation, mark bet as inactive
        */
        const OverunderDocuments = await Overunder.find({ overBetters: { $ne: [] }, underBetters: { $ne: [] }, winner: { $exists: true, $ne: '' }, active: true }).exec();
        console.log('Matching Overunder Documents:', OverunderDocuments);
        let WinnersCalc = new Map();
        if (OverunderDocuments !== null) {
            for (const doc of OverunderDocuments) {
                const overBetters = doc.overBetters;
                const underBetters = doc.underBetters;
                const winner = doc.winner;

                if (winner === 'overBetters') {
                    overBetters.forEach((winner) => {
                        underBetters.forEach((loser) => {
                            const betString = `${loser}->${winner}`
                            const reversebetString = `${winner}->${loser}`

                            // Check reverse first to see if we can just cancel out
                            if (WinnersCalc.has(reversebetString) && WinnersCalc.get(reversebetString) > 0) {
                                WinnersCalc.set(reversebetString, WinnersCalc.get(reversebetString) - parseInt(process.env.BET_AMT));
                                if (WinnersCalc.get(reversebetString) === 0) { delete WinnersCalc[reversebetString]; } 
                                return;
                            }
                            
                            // If there's no reverse, calculate as normal
                            if (!WinnersCalc.has(betString)) {
                                WinnersCalc.set(betString, parseInt(process.env.BET_AMT));
                            } else {
                                WinnersCalc.set(betString, WinnersCalc.get(betString) + 1);
                            }
                        });
                    });
                } 
                else {
                    underBetters.forEach((winner) => {
                        overBetters.forEach((loser) => {
                            const betString = `${loser}->${winner}`
                            const reversebetString = `${winner}->${loser}`

                            // Check reverse first to see if we can just cancel out
                            if (WinnersCalc.has(reversebetString) && WinnersCalc.get(reversebetString) > 0) {
                                WinnersCalc.set(reversebetString, WinnersCalc.get(reversebetString) - parseInt(process.env.BET_AMT));
                                if (WinnersCalc.get(reversebetString) === 0) { delete WinnersCalc[reversebetString]; } 
                                return;
                            }
                            
                            // If there's no reverse, calculate as normal
                            if (!WinnersCalc.has(betString)) {
                                WinnersCalc.set(betString, parseInt(process.env.BET_AMT));
                            } else {
                                WinnersCalc.set(betString, WinnersCalc.get(betString) + 1);
                            }
                        });
                    });
                }
            }
        }

        const VsDocuments = await Vs.find({ oneBetters: { $ne: [] }, twoBetters: { $ne: [] }, winner: { $exists: true, $ne: '' }, active: true }).exec();
        console.log('Matching Vs Documents:', VsDocuments);
        if (VsDocuments != null) {
            for (const doc of VsDocuments) {
                const oneBetters = doc.oneBetters;
                const twoBetters = doc.twoBetters;
                const winner = doc.winner;
                console.log(`${oneBetters} ${twoBetters} ${winner}`)
    
                if (winner === 'oneBetters') {
                    oneBetters.forEach((winner) => {
                        twoBetters.forEach((loser) => {
                            const betString = `${loser}->${winner}`
                            const reversebetString = `${winner}->${loser}`
    
                            // Check reverse first to see if we can just cancel out
                            if (WinnersCalc.has(reversebetString) && WinnersCalc.get(reversebetString) > 0) {
                                WinnersCalc.set(reversebetString, WinnersCalc.get(reversebetString) - parseInt(process.env.BET_AMT));
                                if (WinnersCalc[reversebetString] === 0) { delete WinnersCalc[reversebetString]; } 
                                return;
                            }
                            
                            // If there's no reverse, calculate as normal
                            if (!WinnersCalc.has(betString)) {
                                WinnersCalc.set(betString, parseInt(process.env.BET_AMT));
                            } else {
                                WinnersCalc.set(betString, WinnersCalc.get(betString) + 1);
                            }
                        });
                    });
                } 
                else {
                    twoBetters.forEach((winner) => {
                        oneBetters.forEach((loser) => {
                            const betString = `${loser}->${winner}`
                            const reversebetString = `${winner}->${loser}`
    
                            // Check reverse first to see if we can just cancel out
                            if (WinnersCalc.has(reversebetString) && WinnersCalc.get(reversebetString) > 0) {
                                WinnersCalc.set(reversebetString, WinnersCalc.get(reversebetString) - parseInt(process.env.BET_AMT));
                                if (WinnersCalc[reversebetString] === 0) { delete WinnersCalc[reversebetString]; } 
                                return;
                            }
                            
                            // If there's no reverse, calculate as normal
                            if (!WinnersCalc.has(betString)) {
                                WinnersCalc.set(betString, parseInt(process.env.BET_AMT));
                            } else {
                                WinnersCalc.set(betString, WinnersCalc.get(betString) + 1);
                            }
                        });
                    });
                }
            }
        }

        // Go through Winners and update leaderboard
        // Create the Embed to send            
        const newEmbed = new EmbedBuilder()
            .setColor('#118c4f')
            .setTitle('Pay Up Bitches');
        const embedDict = new Map();

        console.log(WinnersCalc)
        for (const [key, value] of WinnersCalc) {
            let splitKey = key.split('->');
            let loser = splitKey[0];
            let winner = splitKey[1];

            if (value === 0) { continue; }

            try {
				const result = await Leaderboard.findOneAndUpdate({ username: winner }, 
					{ $inc: { money: [value] } }, 
					{ upsert: true, new: true });
				
				if (result !== null) {
					console.log(`Added ${value.toString()} to ${winner}`)
				}
				else {
					console.log(`Didn't find document. Adding ${username} to leaderboard.`);
				}
			} catch (error) {
				console.error('Error finding and replacing document:', error);
			}

            try {
				const result = await Leaderboard.findOneAndUpdate({ username: loser }, 
					{ $inc: { money: [-value] } }, 
					{ upsert: true, new: true });
				
				if (result !== null) {
					console.log(`Removed ${value.toString()} from ${loser}`)
				}
				else {
					console.log(`Didn't find document. Adding ${username} to leaderboard.`);
				}
			} catch (error) {
				console.error('Error finding and replacing document:', error);
			}
            
            if (!embedDict.has(loser)) {
                embedDict.set(loser, [winner]);
            } else {
                loserArray = embedDict.get(loser);
                loserArray.push(winner);
                embedDict.set(loser, loserArray);
            }
            
            newEmbed.addFields( {name: '\u200B', value: `${loser} owes ${winner} $${value}`} );
            // Add to dictionary here instead
        }
        // Loop through KEYS of the dictionary, create an Embed for each user that owes 

        // Make a separate Embed for each user that owes 
        interaction.reply({ embeds: [newEmbed] });
	},
};
