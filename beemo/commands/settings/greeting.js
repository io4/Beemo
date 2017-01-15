function formatGreeting(greeting, member) {
    greeting.replace("%mention%", member.toString());
    greeting.replace("%server%", member.guild.name);
    return greeting;
}

module.exports = {
    main: async (bot, message, dmOrMessage, ...greeting) => {
    	if(message.content == "") {
    		//Delete the key
    		await message.guild.redis.delAsync("greeting_message");
            await message.guild.redis.delAsync("greeting_in_dm");
    		message.reply("I've disabled the greeting.");
    	} else {
            if(dmOrMessage == "dm") {
                await message.guild.redis.setAsync("greeting_in_dm", "true");
            } else {
                await message.guild.redis.delAsync("greeting_in_dm");
            }

            await message.guild.redis.setAsync("greeting_message", greeting.join(" "));

            message.reply("Alright, I've set the greeting.");
    	}
    },
    onGuildMemberAdd: async (client, member) => {

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
            channel.sendMessage(greeting);
        }
    },
    help: 'Set a guild/server greeting.',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD',
    args: '<dm|channel> <message>'
};
