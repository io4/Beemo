module.exports = {
    main: async (bot, message, ...args) => {bnnbnbnbnbnbnbnbnbn
    	if(message.content == "") {
    		//Delete the key
    		await message.guild.redis.delAsync("prefix");
    		message.reply("I've reset the command prefix.");
    	} else {
    		await message.guild.redis.setAsync("prefix", message.content);
    		message.reply(`I've set the command prefix to \`${message.content}\`.`);
    	}
    },
    help: 'Set the bot\'s prefix for this server',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD',
    args: '<prefix>'
};