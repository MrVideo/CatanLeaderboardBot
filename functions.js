const { EmbedBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const { dbName } = require('./config.json');

async function makeLeaderboardEmbed() {
	const db = new sqlite.Database(dbName);

	try {
		const rows = await new Promise((resolve, reject) => {
			db.all('SELECT * FROM Points ORDER BY Wins DESC', (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});

		let embed = new EmbedBuilder();
		embed.setTitle('Leaderboard');

		if (rows.length !== 0) {
			rows.forEach((row) => {
				embed.addFields({
					name: row.Username,
					value: `${row.Wins}`
				});
			});
		} else {
			embed.addFields({
				name: 'No players yet',
				value: 'Play more Catan!'
			});
		}

		return embed;
	} catch (error) {
		console.error('Error fetching leaderboard: ', error)
	} finally {
		db.close();
	}
}

async function getMessageId() {
	const db = new sqlite.Database(dbName);

	try {
		const messageRow = await new Promise((resolve, reject) => {
			db.get('SELECT MessageID FROM Message LIMIT 1', (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			});
		});

		if (messageRow) {
			return messageRow.MessageID;
		} else {
			return null;
		}
	} catch(error) {
		console.error('Error fetching message ID: ', error);
	} finally {
		db.close();
	}
}

async function getChannelId() {
	const db = new sqlite.Database(dbName);

	try {
		const channelRow = await new Promise((resolve, reject) => {
			db.get('SELECT ChannelID FROM Channel LIMIT 1', (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			});
		});

		if (channelRow) {
			return channelRow.ChannelID;
		} else {
			return null;
		}
	} catch(error) {
		console.error('Error fetching channel ID: ', error);
	} finally {
		db.close();
	}
}

function log(string) {
	let currentDate = new Date();
	let day = currentDate.getDate();
	let month = currentDate.getMonth() + 1;
	let year = currentDate.getFullYear();
	let hours = currentDate.getHours();
	let minutes = currentDate.getMinutes();
	let seconds = currentDate.getSeconds();

	const timestamp = "[" + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "]";
	console.log(timestamp + " " + string);
}

module.exports = {
	makeLeaderboardEmbed,
	getMessageId,
	getChannelId,
	log
}
