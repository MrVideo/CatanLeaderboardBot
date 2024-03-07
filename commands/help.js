const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Returns a list of commands'),
	async execute(interaction) {
		// Embed declaration
		const helpEmbed = {
			title: 'Command list',
			description: "You can also see commands by typing '/' in the chat.",
			thumbnail: {
				url: 'https://i.ibb.co/hVXnBCs/helpicon.png'
			},
			fields: [
				{
					name: 'Help',
					value: '`/help`'
				},
				{
					name: 'Show leaderboard',
					value: '`/leaderboard`'
				},
				{
					name: 'Add a point to the player that invokes the command',
					value: '`/winner`'
				},
				{
					name: 'Add a new player to the leaderboard with score zero',
					value: '`/init`'
				},
				{
					name: 'Bot info',
					value: '`/about`'
				},
			]
		}

		// Respond to user
		await interaction.reply({ embeds: [helpEmbed] });
	},
};
