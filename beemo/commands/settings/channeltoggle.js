module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKey = `server:${message.guild.id}:channel:${message.channel.id}:disabled`;
    	var currentSetting = await bot.redis.getAsync(redisKey);
   		//key exists = commands disabled

   		if(currentSetting != null) {
   			//Delete the key (enable commands)

   			await bot.redis.delAsync(redisKey);
   			message.reply("I've enabled commands for this channel.");
   		} else {
   			//Set the key
   			await bot.redis.setAsync(redisKey, "True");
   			message.reply("I've disabled commands for this channel.");
   		}
    },
    help: 'Disable/Enable commands in a channel',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD'
};