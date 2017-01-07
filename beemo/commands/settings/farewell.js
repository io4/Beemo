module.exports = {
    main: async (bot, message, dmOrMessage, ...farewell) => {
    	var redisKey = `server:${message.guild.id}:farewell_message`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
            await bot.redis.delAsync(inDmKey);
    		message.reply("I've disabled the farewell message.");
    	} else {

            await bot.redis.setAsync(redisKey, farewell.join(" "));

            message.reply("alright, I've set the farewell message.");
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
    roleRequired: 'Beemo Admin',
    args: '<message>'
};