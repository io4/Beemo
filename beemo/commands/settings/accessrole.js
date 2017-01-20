module.exports = {
    main: async (bot, message, ...args) => {
    	if(message.content == "") {
    		//Delete the key
    		message.guild.redis.delAsync("access_role");
    		message.reply("I've disabled the access role.");
    	} else {
            //Check if the role exists
            let role = bot.resolve.role(message.content, message.guild);
            if(role == false){
                message.reply("Role not found!");
                return
            }
    		await message.guild.redis.setAsync("access_role", message.content);
    		message.reply(`I've set the access role to \`${message.content}\`.`);
    	}
    },
    help: 'Set the role that Beemo only listens to.',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD',
    args: '<role name>'
};
