const { SlashCommandBuilder } = require('discord.js');
const sqlite = require('sqlite3').verbose();
const { dbName } = require('../config.json');
const { makeLeaderboardEmbed, getMessageId, getChannelId, log } = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Sends the leaderboard message in a predefined channel and updates it automatically.'),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const db = new sqlite.Database(dbName);

		try {
			// Check whether the initial message was already sent
			const messageId = await getMessageId();
			const savedChannelId = await getChannelId();

			if (messageId && savedChannelId) {
				await interaction.editReply('A leaderboard message was already sent.');
				log("Attempt to initialise with a leaderboard message present");
			} else {
				const leaderboardEmbed = await makeLeaderboardEmbed();

				const channelId = await interaction.channelId;

				await new Promise((resolve, reject) => {
					db.run('INSERT INTO Channel VALUES(?)', [channelId], (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});

				const channel = await interaction.channel;

				if (channel != null) {
					const sentMessage = await channel.send({ embeds: [leaderboardEmbed] });

					await new Promise((resolve, reject) => {
						db.run('INSERT INTO Message VALUES(?)', [sentMessage.id], (err) => {
							if (err) {
								reject(err);
							} else {
								resolve();
							}
						});
					});

					log("Initialised leaderboard message with ID " + sentMessage.id + " on channel with ID " + channelId);
				}

				await interaction.editReply("Done.");
			}
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.log('Error: ', err);
		} finally {
			db.close();
		}
	},
};
