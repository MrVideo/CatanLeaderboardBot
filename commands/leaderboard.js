const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the current leaderboard'),

	async execute(interaction) {
		// Defer reply
		await interaction.deferReply();

		try {
			const db = new sqlite.Database(dbName);

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

				await interaction.editReply({ embeds: [queryResponseEmbed] });
			} else {
				await interaction.editReply('Empty leaderboard. Play more Catan!');
			}

			db.close();
		} catch (err) {
			await interaction.followUp('Something went wrong.');
			console.log('Error: ', err);
		}
	},
};
