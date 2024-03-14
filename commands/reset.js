const { SlashCommandBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');
const { getMessageId, log, getChannelId } = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Removes the leaderboard message from the channel'),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const db = new sqlite.Database(dbName);

		try {
			// Gets the message saved by the bot earlier
			const messageId = await getMessageId();
			const savedChannelId = await getChannelId();

			if (!messageId && !savedChannelId) {
				// If the message was never sent, then an error message is sent to the user
				await interaction.editReply('You cannot reset the bot before initialising it.');
			} else {
				const channel = await interaction.client.channels.fetch(savedChannelId);

				if (channel) {
					channel.messages.delete(messageId);

					await interaction.editReply('Done.');
					log("Removed leaderboard message");
				} else throw new Error('Unable to fetch channel');

				await new Promise((resolve, reject) => {
					db.run('DELETE FROM Message', [], (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});

				await new Promise((resolve, reject) => {
					db.run('DELETE FROM Channel', [], (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});

			}
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.error('Error: ', err);
		} finally {
			db.close();
		}
	}
};
