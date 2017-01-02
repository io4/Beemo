module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToBan = message.guild.member(bot.resolve.user(message));

        if(typeof memberToBan == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        try {
            await memberToBan.ban();
            message.reply(":ok_hand:");
        } catch (err) {
            message.reply("Unable to ban, do I have the correct permissions?");
        }
    },
    help: 'Ban a member',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<mention>'
};
