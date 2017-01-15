const rp = require('request-promise');

module.exports = async client => {
	if(client.credentials.serverCountKeys.discordBots) {
		await rp({
			method: 'POST',
			json: true,
			uri: `https://bots.discord.pw/api/bots/${client.user.id}/stats`,
			body: {
				shard_id: client.shard.id,
				shard_count: client.shard.count,
				server_count: client.guilds.size,
			},
			headers: {
				'Authorization': client.credentials.serverCountKeys.discordBots
			}
		});
	}

	if(client.credentials.serverCountKeys.carbonitex) {
		await rp({
			method: 'POST',
			json: true,
			uri: `https://www.carbonitex.net/discord/data/botdata.php`,
			body: {
				key: client.credentials.serverCountKeys.carbonitex,
				servercount: client.guilds.size,
				shard_id: client.shard.id,
				shard_count: client.shard.count
			}
		});
	}

}