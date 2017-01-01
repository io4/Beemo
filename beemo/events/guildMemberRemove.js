function formatFarewell(farewell, member) {
	farewell.replace("%mention%", member.toString());
	farewell.replace("%server%", member.guild.name);
	return farewell;
}

module.exports = async (client, member) => {
	//Log channel
	var redisKey = `server:${member.guild.id}:logchannel`;

	var doLog = await client.redis.getAsync(redisKey);

	if(doLog != null) {
		//Find the channel
		let channel = member.guild.channels.get(doLog);

		if(channel != null) {
			//Send the message
			channel.sendMessage(`${member.user.username}#${member.user.discriminator} has left the guild.`);
		} else {
			//delete the key, the channel doesn't exist.
			await client.redis.delAsync(redisKey);
		}
	}
	//farewell
	var redisKey = `server:${member.guild.id}:farewell_message`;

	var farewell = await client.redis.getAsync(redisKey);

	if(farewell != null) {
		//dm/default channnel
		var channel = member.guild.defaultChannel;
		var farewell = formatFarewell(farewell, member);
		channel.sendMessage(farewell);
	}
}