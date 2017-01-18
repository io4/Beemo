module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToKick = bot.resolve.member(message.content, message.guild);

        if(!memberToKick) {
            message.reply("Invalid member.");
            return;
        }
        try {
            await memberToKick.kick();
        } catch (err) {
            message.reply("Unable to kick, do I have the correct permissions?");
            return;
        }
        message.reply(":ok_hand:");
    },
    help: 'Kicks a member',
    guildOnly: true,
    permissionRequired: 'KICK_MEMBERS',
    args: '<mention|id|username>'
};
