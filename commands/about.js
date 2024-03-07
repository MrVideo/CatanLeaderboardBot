const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Gives info about this bot'),
	async execute(interaction) {
		// Embed declaration
		const aboutEmbed = {
			title: 'Catan Leaderboard Bot',
			description: 'Created by @xmrvideo, just for fun (and profit)',
			fields: [
				{
					name: 'GitHub Repo',
					value: '[Clicca qui](https://github.com/MrVideo/CatanLeaderboardBot)'
				},
			]
		}

		// Respond to user
		await interaction.reply({ embeds: [aboutEmbed] });
	},
};
