module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToBan = message.guild.member(bot.resolve.user(message));

        if(typeof memberToBan == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        try {
            await memberToBan.ban();
        } catch (err) {
            message.reply("Unable to ban, do I have the correct permissions?");
            return;
        }
        message.channel.sendEmbed({description: "<:banne:243432527920889856>"});
    },
    help: 'Ban a member',
    guildOnly: true,
    permissionRequired: 'BAN_MEMBERS',
    args: '<mention|id|username>'
};
