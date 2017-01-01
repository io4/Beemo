const resolveNum = require("../../util/resolveNum.js");

module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKey = `server:${message.guild.id}:mentionspam_count`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
    		await message.reply("I've disabled mention spam banning.");
    	} else {
            var mentionspamcount = resolveNum(message.content);
            if(!mentionspamcount) {
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
    help: 'Set the amount of mentions a user can send in a message before I ban them.',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<prefix>'
};