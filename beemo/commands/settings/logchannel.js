module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKey = `server:${message.guild.id}:logchannel`;
        //console.log(message.mentions);
    	if(message.mentions.channels == null) {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
    		message.reply("I've disabled the log channel.");
    	} else {
            //Check if the role exists
            let channel = message.mentions.channels.first();
            if(channel.type != "text") {
                message.reply("The channel must be a text channel.");
                return;
            }
    		await bot.redis.setAsync(redisKey, channel.id);
    		message.reply(`I've set the log channel to \`${channel.name}\`.`);
    	}
    },
    help: 'Set the channel where beemo can log joins/leaves.',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<channel>'
};