module.exports = {
    main: async (bot, message, ...args) => {
    	var currentSetting = await message.channel.redis.getAsync("disabled");
   		//key exists = commands disabled

   		if(currentSetting != null) {
   			//Delete the key (enable commands)

   			await message.channel.redis.delAsync("disabled");
   			message.reply("I've enabled commands for this channel.");
   		} else {
   			//Set the key
   			await message.channel.redis.setAsync("disabled", "True");
   			message.reply("I've disabled commands for this channel.");
   		}
    },
    help: 'Disable/Enable commands in a channel',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD'
};