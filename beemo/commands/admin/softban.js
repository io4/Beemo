module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToBan = bot.resolve.user(message);

        if(!memberToBan) {
            message.reply("Invalid user.");
            return;
        }
        try {
            await memberToBan.ban(7);
            await message.guild.unban(memberToBan);
        } catch (err) {
            message.reply("Unable to softban, do I have the correct permissions?");
            return;
        }
        message.channel.sendEmbed({description: "<:banne:243432527920889856>"});
    },
    help: 'Softbans a user',
    guildOnly: true,
    permissionRequired: 'BAN_MEMBERS',
    args: '<mention|id|username>'
};
