module.exports = {
    main: async (bot, message, dmOrMessage, ...farewell) => {
    	if(message.content == "") {
    		//Delete the key
    		await message.guild.redis.delAsync("farewell_message");
    		message.reply("I've disabled the farewell message.");
    	} else {

            await message.guild.redis.setAsync("farewell_message", farewell.join(" "));

            message.reply("Alright, I've set the farewell message.");
    	}
    },
    onGuildMemberRemove: async (client, member) => {
        //farewell
        var redisKey = `server:${member.guild.id}:farewell_message`;

        var farewell = await client.redis.getAsync(redisKey);

        if(farewell != null) {
            //dm/default channnel
            var channel = member.guild.defaultChannel;
            var farewell = formatFarewell(farewell, member);
            channel.sendMessage(farewell);
        }
    },
    help: 'Set a guild/server farewell.',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD',
    args: '<message>'
};
