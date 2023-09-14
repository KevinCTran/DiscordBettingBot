const { Events } = require('discord.js');
const connectDB = require('../db');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		connectDB();
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};