const { SlashCommandBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');
const { makeLeaderboardEmbed, getMessageId, getChannelId, log } = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addme')
		.setDescription('Adds a player to the leaderboard with zero points.'),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const db = new sqlite.Database(dbName);

		try {
			const username = interaction.user.username;

			await new Promise((resolve, reject) => {
				db.run('INSERT OR IGNORE INTO Points (Username) VALUES (?)', [username], (err) => {
					if (err) {
						reject(err);
					} else {
						resolve(this.lastID);
					}
				});
			});

			const messageId = await getMessageId();

			if (!messageId) {
				// If the message was never sent, then an error message is sent to the user
				await interaction.editReply('No leaderboard message found. Execute `/init` first.');
			} else {
				// Otherwise, the updated leaderboard is used to update said message
				const channel = await interaction.client.channels.fetch(await getChannelId());

				if (channel) {
					channel.messages.edit(messageId, { embeds: [await makeLeaderboardEmbed()] });

					await interaction.editReply('Done.');
					log("Added " + username + " to leaderboard");
				} else throw new Error('Unable to fetch channel');
			}
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.log('Error: ', err);
		} finally {
			db.close();
		}
	},
};
