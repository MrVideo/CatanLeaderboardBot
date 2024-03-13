const { SlashCommandBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName, channelId } = require('../config.json');
const { makeLeaderboardEmbed, getMessageId, log } = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addme')
		.setDescription('Adds a player to the leaderboard with zero points.'),

	async execute(interaction) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		try {
			// Connect to database
			const db = new sqlite.Database(dbName);

			// Get username from user that invokes the command
			const username = interaction.user.username;

			// Promise that runs the insert query
			const insertStatement = db.prepare('INSERT OR IGNORE INTO Points (Username) VALUES (?)');

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
				await interaction.editReply('Done.');
			}

			db.close();
			log("Added " + username + " to leaderboard");
			
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.log('Error: ', err);
		}
	},
};
