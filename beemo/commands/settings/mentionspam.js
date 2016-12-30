module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKey = `server:${message.guild.id}:mentionspam_count`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
    		await message.reply("I've disabled mention spam banning.");
    	} else {
            //
            var mentionspamcount = parseInt(message.content);
            if(mentionspamcount == NaN) {
                await message.reply("The count must be an integer.");
                return;
            }

            if(mentionspamcount == 1) {
                await message.reply("No.");
                return;
            }
    		await bot.redis.setAsync(redisKey, message.content);
    		await message.reply(`I've set the mention amount to \`${message.content}\`.`);
    	}
    },
    help: 'Set the bot\'s prefix for this server',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<prefix>'
};