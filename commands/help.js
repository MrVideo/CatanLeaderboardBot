const { SlashCommandBuilder } = require('discord.js');
const { log } = require('../functions.js');

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
					name: 'Bot info',
					value: '`/about`'
				},
				{
					name: 'Creates the leaderboard message in a predefined channel',
					value: '`/init`'
				},
				{
					name: 'Removes the leaderboard message (the data remains intact)',
					value: '`/reset`'
				},
				{
					name: 'Add a player with score zero',
					value: '`/addme`'
				},
				{
					name: 'Add a point to the player that invokes the command',
					value: '`/winner`'
				}
			]
		}

		log("User asked for help");
		
		// Respond to user
		await interaction.reply({ ephemeral: true, embeds: [helpEmbed] });
	},
};
