module.exports = {
    main: async (bot, message, dmOrMessage, ...farewell) => {
    	var redisKey = `server:${message.guild.id}:farewell_message`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
            await bot.redis.delAsync(inDmKey);
    		await message.reply("I've disabled the farewell message.");
    	} else {

            await bot.redis.setAsync(redisKey, farewell.join(" "));

            await message.reply("alright, I've set the farewell message.");
    	}
    },
    help: 'Set a guild/server farewell.',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<message>'
};