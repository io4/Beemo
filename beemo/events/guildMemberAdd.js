function formatGreeting(greeting, member) {
	greeting.replace("%mention%", member.toString());
	greeting.replace("%server%", member.guild.name);
	return greeting;
}

module.exports = async (client, member) => {
	//Log channel
	var redisKey = `server:${member.guild.id}:logchannel`;

	var doLog = await client.redis.getAsync(redisKey);

	if(doLog != null) {
		//Find the channel
		var channel = member.guild.channels.get(doLog);

		if(channel != null) {
			//Send the message
			await channel.sendMessage(`${member.user.username}#${member.user.discriminator} has joined the guild.`);
		} else {
			//delete the key, the channel doesn't exist.
			await client.redis.delAsync(redisKey);
		}
	}

	var redisKey = `server:${member.guild.id}:greeting_message`;
	var inDmKey = `server:${member.guild.id}:greeting_in_dm`;

	var greeting = await client.redis.getAsync(redisKey);
	var inDm = await client.redis.getAsync(inDmKey);

	if(greeting != null) {
		//dm/default channnel
		if(inDm != null) {
			var channel = member;
		} else {
			var channel = member.guild.defaultChannel;
		}
		var greeting = formatGreeting(greeting, member);
		await channel.sendMessage(greeting);
	}
}