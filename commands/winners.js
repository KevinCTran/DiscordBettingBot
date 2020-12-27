const Discord = require('discord.js');
require("dotenv").config();


module.exports = {
	name: 'winners',
    description: 'Calculate and display winners for the day',
    args: false,
	execute(message, args, ouBets, vsBets, messageIds, winnerMap) {
        let WinnersCalc = new Map();

        for (let [key, value] of winnerMap) {
            console.log('key: ' + key + " value: " + value);
            let oneArray;
            let twoArray;
            let left;
            let right;
            if (key.includes(" vs ")) {
                oneArray = [...vsBets.get(key).ONE].sort();
                twoArray = [...vsBets.get(key).TWO].sort();
                left = "ONE";
                right = "TWO";
            } else {
                oneArray = [...ouBets.get(key).OVER].sort();
                twoArray = [...ouBets.get(key).UNDER].sort();
                left = "OVER";
                right = "UNDER";
            }

            if (oneArray.length == twoArray.length) {
                let winString;

                for (i=0; i < twoArray.length; i++) {
                    if (value === left) {
                        winString = `${twoArray[i]}->${oneArray[i]}`;
                            
                    } else if (value === right) {
                        winString = `${oneArray[i]}->${twoArray[i]}`;
                    }
                    
                    // If exists, increment. Else, set to 1
                    if (WinnersCalc.has(winString)) {
                        WinnersCalc.set(winString, WinnersCalc.get(winString) + 1);
                    } else {
                        WinnersCalc.set(winString, 1);
                    }
                }
            } 
            else {
                // Not the same amount of betters, so everyone pays everyone
                let winnerArray;
                let loserArray;
                if (value === left) {
                    winnerArray = oneArray;
                    loserArray = twoArray;
                } else if (value === right) {
                    winnerArray = twoArray;
                    loserArray = oneArray;
                }
                
                for (i = 0; i < winnerArray.length; i++) {
                    let winner = winnerArray[i];
                    for (j = 0; j < loserArray.length; j++) {
                        let winString = `${loserArray[j]}->${winner}`;
                    
                        // If exists, increment. Else, set to 1
                        if (WinnersCalc.has(winString)) {
                            WinnersCalc.set(winString, WinnersCalc.get(winString) + 1);
                        } else {
                            WinnersCalc.set(winString, 1);
                        }
                    }
                    
                }
            }
        }

        // Do calculations for reverse 
        // Ex.) gav->kev, 1
        //      kev->gav, 1
        //     Should cancel out so nobody owes anyone
        // Output winners
        console.log("Before fuckin with it");
        console.log([...WinnersCalc]);
        for (let [key, value] of WinnersCalc) {
            if (value == -1) {
                console.log(`${key} value is -1`)
                continue;
            }
            let splitKey = key.split('->');
            let loser = splitKey[0];
            let winner = splitKey[1];

            let opposite = `${winner}->${loser}`;
            if (WinnersCalc.has(opposite) && WinnersCalc.get(opposite) != -1) {
                console.log(`${winner} owes ${loser} ${WinnersCalc.get(opposite)} later on.`);

                let futureOweAmt = WinnersCalc.get(opposite);

                if (futureOweAmt == value) {
                    // Amount is the same, cancel out
                    console.log("Canceling both out");
                    WinnersCalc.set(key, -1);
                    WinnersCalc.set(opposite, -1);
                } else if (futureOweAmt < value) {
                    // Still owe winner money
                    console.log(`Setting ${key} to ${value - futureOweAmt}`);
                    WinnersCalc.set(key, value - futureOweAmt);
                    WinnersCalc.set(opposite, -1);
                } else {
                    // Winner actually owes loser money
                    console.log(`Setting ${opposite} to ${WinnersCalc.get(opposite) - value}`)
                    WinnersCalc.set(opposite, WinnersCalc.get(opposite) - value);
                    WinnersCalc.set(key, -1);
                }
            }
        }

        // Output winners
        console.log("AFTER");
        console.log([...WinnersCalc]);
        for (let [key, value] of WinnersCalc) {
            if (value == -1) continue;

            let splitKey = key.split('->');
            let loser = splitKey[0];
            let winner = splitKey[1];
            let oweString = `\`${loser} owes ${winner} $${value}\``;

            message.channel.send(oweString);
        }
    },
};