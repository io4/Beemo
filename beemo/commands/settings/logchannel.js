module.exports = {
    main: async (bot, message, ...args) => {;
    	if(message.mentions.channels == null) {
    		//Delete the key
    		await message.guild.redis.delAsync("logchannel");
    		message.reply("I've disabled the log channel.");
    	} else {
            //Check if the role exists
            let channel = message.mentions.channels.first();
            if(channel.type != "text") {
                message.reply("The channel must be a text channel.");
                return;
            }
    		await message.guild.redis.setAsync("logchannel", channel.id);
    		message.reply(`I've set the log channel to \`${channel.name}\`.`);
    	}
    },
    onGuildMemberAdd: async (client, member) => {
        //Log channel
        var redisKey = `server:${member.guild.id}:logchannel`;

        var doLog = await message.guild..redis.getAsync(redisKey);

        if(doLog != null) {
            //Find the channel
            var channel = member.guild.channels.get(doLog);

            if(channel != null) {
                //Send the message
                channel.sendMessage(`${member.user.username}#${member.user.discriminator} has joined the guild.`);
            } else {
                //delete the key, the channel doesn't exist.
                client.redis.delAsync(redisKey);
            }
        }
    },
    onGuildMemberRemove: async (client, member) => {
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
    },
    help: 'Set the channel where beemo can log joins/leaves.',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD',
    args: '<channel>'
};