const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName, channelId } = require('../config.json');
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

			// Check whether the initial message was already sent
			const messageId = await getMessageId();
			
			if (messageId != undefined) {
				await interaction.editReply('A leaderboard message was already sent.');
				log("Attempt to initialise with a leaderboard message present");
			} else {
				// Initialize embed
				let queryResponseEmbed = new EmbedBuilder()
					.setTitle('Leaderboard')

				// Prepare query
				const queryStatement = db.prepare('SELECT * FROM Points ORDER BY Wins DESC');

				const rows = await new Promise((resolve, reject) => {
					queryStatement.all((err, rows) => {
						queryStatement.finalize();

						if (err)
							reject(err);
						else resolve(rows);
					});
				});

				if (rows.length !== 0) {
					rows.forEach((row) => {
						queryResponseEmbed.addFields({
							name: row.Username,
							value: `${row.Wins}`
						})
					});
				} else {
					queryResponseEmbed.addFields({
						name: "No players yet",
						value: "Play more Catan!"
					});
				}

				const channel = interaction.client.channels.cache.get(channelId);
				if (channel != undefined) {
					channel.send({ embeds: [queryResponseEmbed] })
						.then(async message => {
							const lastId = await new Promise((resolve, reject) => {
								const insertMessageIdStatement = db.prepare('INSERT INTO Message VALUES(?)');

								insertMessageIdStatement.run([message.id], (err) => {
									if (err) {
										reject(err);
									} else {
										resolve(this.lastID);
									}
								});

								insertMessageIdStatement.finalize();
							})

							log("Initialised leaderboard message with ID " + message.id);
					});

					await interaction.editReply("Done.");
				} else {
					await interaction.editReply("Something went wrong.");
					log("Unable to retrieve channel from guild");
				}

				db.close();
			}
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.log('Error: ', err);
		}
	},
};
