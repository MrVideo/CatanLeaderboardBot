const { SlashCommandBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName, channelId } = require('../config.json');
const { makeLeaderboardEmbed, getMessageId, log } = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('winner')
		.setDescription('Adds one point to the player that invokes the command.'),

	async execute(interaction) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		// Get username of user that invokes the command
		const username = interaction.user.username;

		try {
			// Find (or create) SQLite database
			const db = new sqlite.Database(dbName);

			// Promise that runs the insert query
			const insertStatement = db.prepare('UPDATE Points SET Wins = Wins + 1 WHERE Username = ?');

			const lastId = await new Promise((resolve, reject) => {

				insertStatement.run([username], (err) => {
					if (err) {
						reject(err);
					} else {
						resolve(this.lastID);
					}
				});
			});

			insertStatement.finalize();

			// Gets the message saved by the bot earlier
			const messageId = await getMessageId();

			if (messageId === undefined) {
				// If the message was never sent, then an error message is sent to the user
				await interaction.editReply('No leaderboard message found. Execute `/start` first.');
			} else {
				// Otherwise, the updated leaderboard is used to update said message
				const channel = await interaction.client.channels.fetch(channelId);

				if (channel !== undefined) {
					channel.messages.edit(messageId, { embeds: [await makeLeaderboardEmbed()] })
						.catch(console.err);
				}

				// Responds to the user with a confirmation message
				await interaction.editReply('GG!');
			}

			db.close();
			log("Add one point to " + username);
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.error('Error: ', err);
		}
	}
};
