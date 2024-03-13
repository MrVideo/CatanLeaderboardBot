const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');
const { getMessageId, log } = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Sends the leaderboard message in a predefined channel and updates it automatically.'),

	async execute(interaction) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		try {
			const db = new sqlite.Database(dbName);

			// Get username from user that invokes the command
			const username = interaction.user.username;
				log("Attempt to initialise with a leaderboard message present");

			// Prepare query
			const insertStatement = db.prepare('INSERT OR IGNORE INTO Points (Username) VALUES (?)');

			insertStatement.run([username]);
			insertStatement.finalize();

			db.close();
			await interaction.editReply('Done.');
							log("Initialised leaderboard message with ID " + message.id);
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.log('Error: ', err);
		}
	},
};
