module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToBan = message.guild.member(bot.resolve.user(message));

        if(typeof memberToBan == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        try {
            await memberToBan.kick();
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
