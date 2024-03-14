const { SlashCommandBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');
const { makeLeaderboardEmbed, getMessageId, getChannelId, log } = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('winner')
		.setDescription('Adds one point to the player that invokes the command.'),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		// Get username of user that invokes the command
		const username = interaction.user.username;

		const db = new sqlite.Database(dbName);

		try {
			// Gets the message saved by the bot earlier
			const messageId = await getMessageId();

			if (!messageId) {
				// If the message was never sent, then an error message is sent to the user
				await interaction.editReply('No leaderboard message found. Execute `/init` first.');
			} else {
				await new Promise((resolve, reject) => {
					db.run('UPDATE Points SET Wins = Wins + 1 WHERE Username = ?', [username], (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});

				// Otherwise, the updated leaderboard is used to update said message
				const channel = await interaction.client.channels.fetch(await getChannelId());

				if (channel) {
					channel.messages.edit(messageId, { embeds: [await makeLeaderboardEmbed()] });

					await interaction.editReply('GG!');
					log("Add one point to " + username);
				} else throw new Error('Unable to fetch channel');
			}
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.error('Error: ', err);
		} finally {
			db.close();
		}
	}
};
