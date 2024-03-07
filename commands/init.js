const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Adds a player without adding one point to them.'),

	async execute(interaction) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		try {
			const db = new sqlite.Database(dbName);

			// Get username from user that invokes the command
			const username = interaction.user.username;

			// Prepare query
			const insertStatement = db.prepare('INSERT OR IGNORE INTO Points (Username) VALUES (?)');

			insertStatement.run([username]);
			insertStatement.finalize();

			db.close();
			await interaction.editReply('Done.');
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.log('Error: ', err);
		}
	},
};
