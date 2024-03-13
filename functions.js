const { EmbedBuilder } = require('discord.js');
const sqlite = require('sqlite3');
const { dbName } = require('./config.json');

async function makeLeaderboardEmbed() {
	const db = new sqlite.Database(dbName);
	const query = db.prepare('SELECT * FROM Points ORDER BY Wins DESC');

	const rows = await new Promise((resolve, reject) => {
		query.all((err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
		query.finalize();
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

	db.close();
	
	return embed;
}

async function getMessageId() {
	const db = new sqlite.Database(dbName);
	const query = db.prepare('SELECT MessageID FROM Message LIMIT 1');

	const rows = await new Promise((resolve, reject) => {
		query.all((err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});

		query.finalize();
	});

	db.close();

	if (rows[0] === undefined) {
		return undefined;
	} else {
		return rows[0].MessageID;
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
	log
}
