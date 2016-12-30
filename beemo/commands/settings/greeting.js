module.exports = {
    main: async (bot, message, dmOrMessage, ...greeting) => {
    	var redisKey = `server:${message.guild.id}:greeting_message`;
        var inDmKey = `server:${message.guild.id}:greeting_in_dm`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
            await bot.redis.delAsync(inDmKey);
    		await message.reply("I've disabled the greeting.");
    	} else {
            if(dmOrMessage == "dm") {
                await bot.redis.setAsync(inDmKey, "true");
            } else {
                await bot.redis.delAsync(inDmKey);
            }

            await bot.redis.setAsync(redisKey, greeting.join(" "));

            await message.reply("alright, I've set the greeting.");
    	}
    },
    help: 'Set a guild/server greeting.',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<dm|channel> <message>'
};