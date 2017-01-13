class prefixManager {
	constructor(client) {
		this.client = client;
		this.redisManager = client.redisManager;
	}

	async getPrefix(message) {
		var prefixes = Array.from(this.client.credentials.prefixes);

		//Add server prefix (if it exists)
		if(message.guild != null) {
			var serverPrefix = await this.redisManager.getGuildNamespace(message.guild).getAsync("prefix");

			if(serverPrefix != null) {
				var prefixes = [];
				prefixes.push(serverPrefix);
			}
		} else {
			prefixes.push(""); //Have it listen to just "help" in pm, for example
		}

		prefixes.push(`${this.client.user} `);

		return prefixes;
	}

	setPrefix(guild, prefix) {
		return this.redisManager.getGuildNamespace(guild).setAsync(prefix);
	}
}

module.exports = prefixManager;