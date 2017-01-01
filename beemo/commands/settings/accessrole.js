module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKey = `server:${message.guild.id}:access_role`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
    		message.reply("I've disabled the access role.");
    	} else {
            //Check if the role exists
            let role = message.guild.roles.find("name", message.content);
            if(role == null){
                message.reply("Role not found!");
                return
            }
    		await bot.redis.setAsync(redisKey, message.content);
    		message.reply(`I've set the access role to \`${message.content}\`.`);
    	}
    },
    help: 'Set the role that Beemo only listens to.',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<role name>'
};