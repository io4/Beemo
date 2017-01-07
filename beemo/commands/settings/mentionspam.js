module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKey = `server:${message.guild.id}:mentionspam_count`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
    		message.reply("I've disabled mention spam banning.");
    	} else {
            var mentionspamcount = bot.resolve.num(message.content);
            if(!mentionspamcount) {
                message.reply("The count must be an integer.");
                return;
            }

            if(mentionspamcount == 1) {
                message.reply("No.");
                return;
            }
    		await bot.redis.setAsync(redisKey, message.content);
    		message.reply(`I've set the mention amount to \`${message.content}\`.`);
    	}
    },
    onMessage: async (bot, message) => {
        if(message.guild == null) { //no pms
            return;
        }
        var redisKey = `server:${message.guild.id}:mentionspam_count`;

        var doMentionSpam = await bot.redis.getAsync(redisKey);

        if(doMentionSpam != null) {
            var doMentionSpam = bot.resolve.num(doMentionSpam);

            if(message.mentions.users.size >= doMentionSpam) {
                message.member.ban(7).catch(e => {});
            }
        }
    },
    help: 'Set the amount of mentions a user can send in a message before I ban them.',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<prefix>'
};
