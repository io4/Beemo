module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToBan = bot.resolve.user(message.content, message.client);

        if(!memberToBan) {
            message.reply("Invalid user.");
            return;
        }
        try {
            await message.guild.ban(memberToBan);
        } catch (err) {
            message.reply("Unable to ban, do I have the correct permissions?");
            return;
        }
        message.channel.sendEmbed({description: "<:banne:243432527920889856>"});
    },
    help: 'Ban a user',
    guildOnly: true,
    permissionRequired: 'BAN_MEMBERS',
    args: '<mention|id|username|nickname>'
};
