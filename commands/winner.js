const { SlashCommandBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');
const { resolve } = require('path');
const { rejects } = require('assert');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('winner')
		.setDescription('Sets the player that invokes this command as winner'),

	async execute(interaction) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		// Get username of user that invokes the command
		const username = interaction.user.username;

		try {
			// Find (or create) SQLite database
			const db = new sqlite.Database(dbName);

			// Prepare the update statement
			const insertStatement = db.prepare('UPDATE Points SET Wins = Wins + 1 WHERE Username = ?');

			// Run the statement with the passed values and finalise
			insertStatement.run([username]);
			insertStatement.finalize();

			// Close database and tell user everything went smoothly
			db.close();
			await interaction.editReply("GG!");
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.error('Error: ', err);
		}
	}
};
