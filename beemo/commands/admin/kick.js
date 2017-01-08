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
        }
        message.reply(":ok_hand:");
    },
    help: 'Kicks a member',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<mention|id|username>'
};
